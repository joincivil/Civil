import { BigNumber } from "bignumber.js";
import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { expectThrow } from "../utils/expectThrow";
import increaseTime, { duration } from "../utils/increaseTime";
import latestTime from "../utils/latestTime";

configureChai(chai);
const expect = chai.expect;

const DisbursementHandler = artifacts.require("DisbursementHandler");
const Token = artifacts.require("CVLToken");
const NoOpTokenController = artifacts.require("NoOpTokenController");

contract("DisbursementHandler", accounts => {
  let disbursementHandler: any;
  let token: any;

  const owner = accounts[0];
  const notOwner = accounts[1];
  const beneficiaries = accounts.slice(3);
  const beneficiary = beneficiaries[0];

  beforeEach(async () => {
    const controller = await NoOpTokenController.new();
    const totalSupply = new BigNumber(1000000);
    token = await Token.new(totalSupply, "TestCoin", "18", "TEST", controller.address);
    await token.changeController(controller.address);
    disbursementHandler = await DisbursementHandler.new(token.address, { from: owner });
  });

  it("should allow owner to withdraw all of the tokens", async () => {
    const tokenAmount = new web3.BigNumber(100);

    const beforeSetupBalance = await token.balanceOf(owner);
    await token.transfer(disbursementHandler.address, tokenAmount, { from: owner });

    await disbursementHandler.rescueTokens({ from: owner });
    const afterRescueBalance = await token.balanceOf(owner);

    expect(afterRescueBalance).to.bignumber.eq(beforeSetupBalance);
  });

  it("should prevent non-owners from running `rescueTokens`", async () => {
    await expectThrow(disbursementHandler.rescueTokens({ from: notOwner }));
  });

  it("cancel disbursement", async () => {
    const tokenAmount = new web3.BigNumber(100);

    // setup disbursements
    const timestamp1 = (await latestTime()) + duration.weeks(1);
    const timestamp2 = timestamp1 + duration.weeks(3);
    const timestamp3 = timestamp1 + duration.weeks(10);
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp1, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp2, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp3, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp3, { from: owner });
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp3, { from: owner });

    await token.transfer(disbursementHandler.address, tokenAmount * 4, { from: owner });

    let tokenBalance = await token.balanceOf.call(beneficiary);
    expect(tokenBalance).to.bignumber.equal(0);

    // Increase time so we can withdraw from first disbursement
    await increaseTime(duration.weeks(2.1));
    await disbursementHandler.withdraw(beneficiary, { from: beneficiary });
    tokenBalance = await token.balanceOf.call(beneficiary);
    expect(tokenBalance).to.bignumber.equal(100);

    // increase time so that disbursement 2 is valid
    await increaseTime(duration.weeks(2.1));
    // cancel any remaining disbursements
    await disbursementHandler.cancelDisbursement(beneficiary, { from: owner });

    // make sure that disbursement 2 was applied
    tokenBalance = await token.balanceOf.call(beneficiary);
    expect(tokenBalance).to.bignumber.equal(200);

    // beneficiary should not be allowed to access any more tokens
    const withdrawable = await disbursementHandler.calcMaxWithdraw.call(beneficiary);
    expect(withdrawable).to.bignumber.equal(0);

    // beneficiary should have 3x100 disbursements cancelled
    const cancelled = await disbursementHandler.cancelledTokens.call(beneficiary);
    expect(cancelled).to.bignumber.equal(300);

    // add new Disbursements and make sure it still works
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp3, { from: owner });
    // increase time so that disbursement 2 is valid
    await increaseTime(duration.weeks(20));
    await disbursementHandler.withdraw(beneficiary, { from: beneficiary });
    tokenBalance = await token.balanceOf.call(beneficiary);
    // previous balance was 200, so now should be 300
    expect(tokenBalance).to.bignumber.equal(300);

    // beneficiary should not be allowed to access any more tokens
    const newWithdrawable = await disbursementHandler.calcMaxWithdraw.call(beneficiary);
    expect(newWithdrawable).to.bignumber.equal(0);
  });
  it("what happens if there aren't enough tokens?", async () => {
    const tokenAmount = new web3.BigNumber(100);

    // setup disbursements
    const timestamp1 = (await latestTime()) + duration.weeks(1);
    await disbursementHandler.setupDisbursement(beneficiary, tokenAmount, timestamp1, { from: owner });
    await token.transfer(disbursementHandler.address, tokenAmount - 1, { from: owner });

    await increaseTime(duration.weeks(5));
    await expectThrow(disbursementHandler.withdraw(beneficiary, { from: beneficiary }));
  });
});
