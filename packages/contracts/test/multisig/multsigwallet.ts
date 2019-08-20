import { configureChai, getParamFromTxEvent } from "@joincivil/dev-utils";
import * as chai from "chai";
import { configureProviders } from "../utils/contractutils";
import { BN } from "bn.js";

const MultiSigWallet = artifacts.require("MultiSigWallet");
configureProviders(MultiSigWallet);

configureChai(chai);
const expect = chai.expect;

const EXCLUDE_PENDING = false;
const INCLUDE_PENDING = true;
const EXCLUDE_EXECUTED = false;
const INCLUDE_EXECUTED = true;

const sendTransactionAsync = web3.eth.sendTransaction;
const balanceAsync = web3.eth.getBalance;

contract("MultiSigWallet", accounts => {
  let instance: any;
  const REQUIRED_CONFIRMATIONS = 2;
  const NOT_WALLET_OWNER = accounts[9];

  beforeEach(async () => {
    instance = await MultiSigWallet.new([accounts[0], accounts[1], accounts[2]], REQUIRED_CONFIRMATIONS);
  });

  describe("executeTransaction", () => {
    it("works after requirement change", async () => {
      const DEPOSIT = new BN(1000);

      // Send money to the wallet contract
      await sendTransactionAsync({ to: instance.address, value: DEPOSIT, from: accounts[0] });
      const balance = await balanceAsync(instance.address);
      expect(balance).to.be.bignumber.equal(DEPOSIT);

      // Add owner number 4
      const addOwnerData = instance.contract.methods.addOwner(accounts[3]).encodeABI();
      const txIdAddOwner = getParamFromTxEvent<BN>(
        await instance.submitTransaction(instance.address, 0, addOwnerData, { from: accounts[0] }),
        "transactionId",
        "Submission",
      );

      // One pending transaction
      expect(await instance.getTransactionIds(0, 1, INCLUDE_PENDING, EXCLUDE_EXECUTED)).to.be.deep.equal([
        txIdAddOwner,
      ]);

      // Updated required threshold to 1
      const NEW_REQUIRED = 1;
      const updateRequirementsData = instance.contract.methods.changeRequirement(NEW_REQUIRED).encodeABI();
      const txIdChangeRequirement = getParamFromTxEvent(
        await instance.submitTransaction(instance.address, 0, updateRequirementsData, { from: accounts[0] }),
        "transactionId",
        "Submission",
      );

      // Two pending transactios
      expect(await instance.getTransactionIds(0, 2, INCLUDE_EXECUTED, EXCLUDE_EXECUTED)).to.be.deep.equal([
        txIdAddOwner,
        txIdChangeRequirement,
      ]);

      // Confirm change requirement
      await instance.confirmTransaction(txIdChangeRequirement, { from: accounts[1] });
      expect(await instance.required()).to.be.bignumber.equal(NEW_REQUIRED);

      await expect(instance.executeTransaction(txIdAddOwner, { from: NOT_WALLET_OWNER })).to.eventually.be.rejected();

      await instance.executeTransaction(txIdAddOwner, { from: accounts[0] });
      expect(await instance.getTransactionIds(0, 2, EXCLUDE_PENDING, INCLUDE_EXECUTED)).to.be.deep.equal([
        txIdAddOwner,
        txIdChangeRequirement,
      ]);
    });
  });
});
