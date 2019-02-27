import { BigNumber } from "bignumber.js";
import { configureChai } from "@joincivil/dev-utils";
import increaseTime, { duration } from "../utils/increaseTime";
import latestTime from "../utils/latestTime";
import { expectThrow } from "../utils/expectThrow";

import * as chai from "chai";

configureChai(chai);
const assert = chai.assert;

const DisbursementHandler = artifacts.require("DisbursementHandler");
const Token = artifacts.require("CVLToken");
const NoOpTokenController = artifacts.require("NoOpTokenController");

contract("DisbursementHandler", accounts => {
  let disbursementHandler: any;
  let token: any;

  const owner = accounts[0];
  const notOwner = accounts[1];
  const notBeneficiary = accounts[2];
  const beneficiaries = accounts.slice(3);
  const beneficiary = beneficiaries[0];

  beforeEach(async () => {
    const controller = await NoOpTokenController.new();
    const totalSupply = new BigNumber(1000000);
    token = await Token.new(totalSupply, "TestCoin", "18", "TEST", controller.address);
    await token.changeController(controller.address);
    disbursementHandler = await DisbursementHandler.new(token.address, { from: owner });
  });

  it("should be owned by owner", async () => {
    const _owner = await disbursementHandler.owner.call();
    assert.strictEqual(_owner, owner, "Contract is not owned by owner");
  });

  it("should not be possible for other user to change the owner", async () => {
    await expectThrow(disbursementHandler.transferOwnership(notOwner, { from: notOwner, gas: 3000000 }));
  });

  it("should be possible for the owner to transfer ownership", async () => {
    await disbursementHandler.transferOwnership(notOwner, { from: owner, gas: 3000000 });
    const _owner = await disbursementHandler.owner.call();
    assert.strictEqual(_owner, notOwner, "Contract is not owned by new owner");
  });

  it("should be possible for the owner to create a disbursement", async () => {
    const tokenAmount = new web3.BigNumber(100);
    const timestamp = (await latestTime()) + duration.weeks(1);
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp, { from: owner });

    const disbursement = await disbursementHandler.disbursements.call(beneficiary, 0);
    assert.isTrue(disbursement[0].equals(timestamp));
    assert.isTrue(disbursement[1].equals(tokenAmount));
  });

  it("should be possible for the owner to create multiple disbursements for different users", async () => {
    const tokenAmount = new web3.BigNumber(100);
    const timestamp = (await latestTime()) + duration.weeks(1);
    for (let i = 2; i <= 9; i++) {
      await disbursementHandler.setupDisbursement(accounts[i], tokenAmount, timestamp, { from: owner });
    }
    for (let i = 2; i <= 9; i++) {
      const disbursement = await disbursementHandler.disbursements.call(accounts[i], 0);
      assert.isTrue(disbursement[0].equals(timestamp));
      assert.isTrue(disbursement[1].equals(tokenAmount));
    }
  });

  it("should be possible for owner to create multiple disbursements for same beneficiary over time", async () => {
    const tokenAmount = new web3.BigNumber(100);
    const timestamp = (await latestTime()) + duration.weeks(1);
    const timestampTwo = (await latestTime()) + duration.weeks(2);
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestampTwo, { from: owner });

    const disbursement = await disbursementHandler.disbursements.call(beneficiary, 0);
    assert.isTrue(disbursement[0].equals(timestamp));
    assert.isTrue(disbursement[1].equals(tokenAmount));

    const disbursementTwo = await disbursementHandler.disbursements.call(beneficiary, 1);
    assert.isTrue(disbursementTwo[0].equals(timestampTwo));
    assert.isTrue(disbursementTwo[1].equals(tokenAmount));
  });

  it("should not be possible to create a disbursement with a timestamp lower than the current one", async () => {
    const tokenAmount = new web3.BigNumber(100);
    const timestamp = (await latestTime()) - duration.weeks(1);
    await expectThrow(disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp, { from: owner }));
  });

  it("should not be possible for any user to create a disbursement", async () => {
    const tokenAmount = new web3.BigNumber(100);
    const timestamp = (await latestTime()) + duration.weeks(1);
    await expectThrow(disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp, { from: notOwner }));
  });

  it("should be possible for a beneficiary to withdraw the max amount of tokens", async () => {
    const tokenAmount = new web3.BigNumber(100);
    const timestamp = (await latestTime()) + duration.weeks(1);
    await token.transfer(disbursementHandler.address, tokenAmount, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp, { from: owner });

    const disbursement = await disbursementHandler.disbursements.call(beneficiary, 0);
    assert.isTrue(disbursement[0].equals(timestamp), "Timestamp not set right");
    assert.isTrue(disbursement[1].equals(tokenAmount), "Token amount not set right");

    let tokenBalance = await token.balanceOf.call(beneficiary);
    assert.isTrue(tokenBalance.equals(0), "Token balance of beneficiary is not 0");

    // Increase time so we can withdraw
    await increaseTime(duration.weeks(1.1));
    await disbursementHandler.withdraw(beneficiary, { from: beneficiary });

    tokenBalance = await token.balanceOf.call(beneficiary);
    assert.equal(tokenBalance.equals(tokenAmount), true, "Tokens were not withdrawn");

    const withdrawn = await disbursementHandler.withdrawnTokens.call(beneficiary);
    assert.equal(withdrawn.equals(tokenBalance), true, "Withdrawn tokens not set right");
  });

  it("should be possible for anyone to instruct the sending of the beneficiary's tokens ", async () => {
    const tokenAmount = new web3.BigNumber(100);
    const timestamp = (await latestTime()) + duration.weeks(1);
    await token.transfer(disbursementHandler.address, tokenAmount, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp, { from: owner });

    const disbursement = await disbursementHandler.disbursements.call(beneficiary, 0);
    assert.equal(disbursement[0].equals(timestamp), true, "Timestamp not set right");
    assert.equal(disbursement[1].equals(tokenAmount), true, "Token amount not set right");

    let tokenBalance = await token.balanceOf.call(beneficiary);
    assert.equal(tokenBalance.equals(0), true, "Token balance of beneficiary is not 0");

    // Increase time so we can withdraw
    await increaseTime(duration.weeks(1.1));
    await disbursementHandler.withdraw(beneficiary, { from: notBeneficiary });

    tokenBalance = await token.balanceOf.call(beneficiary);
    assert.isTrue(tokenBalance.equals(tokenAmount), "Tokens were not withdrawn");

    const withdrawn = await disbursementHandler.withdrawnTokens.call(beneficiary);
    assert.isTrue(withdrawn.equals(tokenBalance), "Withdrawn tokens not set right");
  });

  it("should ignore disbursements which timestamps have not been reached upon withdrawal", async () => {
    const tokenAmount = new web3.BigNumber(100);

    // First disbursement
    const timestamp1 = (await latestTime()) + duration.weeks(1);
    await token.transfer(disbursementHandler.address, tokenAmount, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp1, { from: owner });

    // Second disbursement
    const timestamp2 = timestamp1 + duration.weeks(1);
    await token.transfer(disbursementHandler.address, tokenAmount, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp2, { from: owner });

    let tokenBalance = await token.balanceOf.call(beneficiary);
    assert.isTrue(tokenBalance.equals(0), "Token balance of beneficiary is not 0");

    // Increase time so we can withdraw
    await increaseTime(duration.weeks(1.1));
    await disbursementHandler.withdraw(beneficiary, { from: beneficiary });

    tokenBalance = await token.balanceOf.call(beneficiary);
    assert.isTrue(tokenBalance.equals(tokenAmount), "Tokens were not withdrawn");

    const withdrawn = await disbursementHandler.withdrawnTokens.call(beneficiary);
    assert.isTrue(withdrawn.equals(tokenBalance), "Withdrawn tokens not set right");
  });

  it("should be possible to withdraw from multiple disbursements", async () => {
    const tokenAmount = new web3.BigNumber(100);

    // First disbursement
    const timestamp1 = (await latestTime()) + duration.weeks(1);
    await token.transfer(disbursementHandler.address, tokenAmount, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp1, { from: owner });

    // Second disbursement
    const timestamp2 = timestamp1 + duration.weeks(1);
    await token.transfer(disbursementHandler.address, tokenAmount, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp2, { from: owner });

    let tokenBalance = await token.balanceOf.call(beneficiary);
    assert.isTrue(tokenBalance.equals(0), "Token balance of beneficiary is not 0");

    // Increase time so we can withdraw from both disbursements
    await increaseTime(duration.weeks(2.1));
    await disbursementHandler.withdraw(beneficiary, { from: beneficiary });

    tokenBalance = await token.balanceOf.call(beneficiary);
    assert.isTrue(tokenBalance.equals(tokenAmount.times(2)), "Tokens were not withdrawn");

    const withdrawn = await disbursementHandler.withdrawnTokens.call(beneficiary);
    assert.isTrue(withdrawn.equals(tokenBalance), "Withdrawn tokens not set right");
  });

  it("should be possible for more than two beneficiaries to withdraw their max tokens", async () => {
    const tokenAmount = new web3.BigNumber(100);
    const tokensToTransfer = new web3.BigNumber(10000);
    const timestamp = (await latestTime()) + duration.weeks(1);
    await token.transfer(disbursementHandler.address, tokensToTransfer, { from: owner });
    for (const b of beneficiaries) {
      await disbursementHandler.setupDisbursement(b, tokenAmount, timestamp, { from: owner });
      const tokenBalance = await token.balanceOf.call(b);
      assert.isTrue(tokenBalance.equals(0), "Token balance of beneficiary is not 0");
    }

    // Increase time so we can withdraw
    await increaseTime(duration.weeks(1.1));

    for (const b of beneficiaries) {
      await disbursementHandler.withdraw(b, { from: b });
      const tokenBalance = await token.balanceOf.call(b);

      assert.isTrue(tokenBalance.equals(tokenAmount), "Token balance of beneficiary is not 0");

      const withdrawn = await disbursementHandler.withdrawnTokens.call(b);
      assert.isTrue(withdrawn.equals(tokenBalance), "Withdrawn tokens not set right");
    }
  });

  it("should not be possible for a non beneficiary to withdraw tokens", async () => {
    const tokenAmount = new web3.BigNumber(100);
    const timestamp = (await latestTime()) + duration.weeks(1);
    await token.transfer(disbursementHandler.address, tokenAmount, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp, { from: owner });

    const disbursement = await disbursementHandler.disbursements.call(beneficiary, 0);
    assert.isTrue(disbursement[0].equals(timestamp), "Timestamp not set right");
    assert.isTrue(disbursement[1].equals(tokenAmount), "Token amount not set right");

    let tokenBalance = await token.balanceOf.call(beneficiary);
    assert.isTrue(tokenBalance.equals(0), "Token balance of beneficiary is not 0");

    // Increase time so beneficiary can withdraw
    await increaseTime(duration.weeks(1.1));
    await expectThrow(disbursementHandler.withdraw(notBeneficiary, { from: notBeneficiary }));

    tokenBalance = await token.balanceOf.call(notBeneficiary);
    assert.isTrue(tokenBalance.equals(0), "Tokens were withdrawn");

    const withdrawn = await disbursementHandler.withdrawnTokens.call(beneficiary);
    assert.isTrue(withdrawn.equals(0), "Withdrawn tokens not set right");
  });
});
