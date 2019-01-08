import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { BigNumber } from "bignumber.js";

configureChai(chai);
const expect = chai.expect;

const NoOpTokenController = artifacts.require("NoOpTokenController");
const CivilTokenController = artifacts.require("CivilTokenController");
const Token = artifacts.require("CVLToken");

contract("CVLToken", accounts => {
  let noOpController;
  let civilTokenController: any;
  let token: any;
  const totalSupply = new BigNumber(1000);
  beforeEach(async () => {
    noOpController = await NoOpTokenController.new();
    civilTokenController = await CivilTokenController.new();
    token = await Token.new(totalSupply, "TestCoin", "18", "TEST", noOpController.address);
  });

  it("should mint all tokens and give to the owner", async () => {
    const ownerBalance = await token.balanceOf.call(accounts[0]);
    expect(ownerBalance.toNumber()).to.eql(totalSupply.toNumber());
  });

  it("should allow Owner to upgrade CVLToken with a new controller", async () => {
    // using the NoOp controller results in no restriction
    let code = await token.detectTransferRestriction.call(accounts[1], accounts[5], 1);
    expect(code.toNumber()).to.eql(0);

    // change the controller and restrictions should now be put in place
    await token.changeController(civilTokenController.address);
    code = await token.detectTransferRestriction.call(accounts[1], accounts[5], 1);
    expect(code.toNumber()).to.eql(1);
  });
  it("should prevent others from changing token controller", async () => {
    return expect(
      token.changeController(civilTokenController.address, { from: accounts[5] }),
    ).to.eventually.be.rejected();
  });

  it("should fail transfers when using the civil token controller", async () => {
    await token.changeController(civilTokenController.address);
    await civilTokenController.addToCore(accounts[0]);
    // this should be successful
    await token.transfer(accounts[1], 1000);
    const account1Balance = await token.balanceOf.call(accounts[1]);
    expect(account1Balance.toNumber()).to.eql(1000);

    // token transfers with restrictions should fail
    return expect(token.transfer(accounts[6], 100, { from: accounts[1] })).to.eventually.be.rejected();
  });

  it("should fail transferFrom when using the civil token controller", async () => {
    await token.changeController(civilTokenController.address);
    await civilTokenController.addToCore(accounts[0]);
    // this should be successful
    await token.transfer(accounts[1], 1000);
    const account1Balance = await token.balanceOf.call(accounts[1]);
    expect(account1Balance.toNumber()).to.eql(1000);

    // allow account[0] to transfer account[1] tokens
    await token.approve(accounts[1], 100, { from: accounts[0] });

    // token transfers with restrictions should fail
    return expect(token.transferFrom(accounts[1], accounts[6], 100, { from: accounts[0] })).to.eventually.be.rejected();
  });

  it("should succeed transfers when using the no op token controller", async () => {
    // token uses NoOp controller, so all transfers should be successfull
    await token.transfer(accounts[1], 1000);
    await token.transfer(accounts[6], 100, { from: accounts[1] });

    const account6Balance = await token.balanceOf.call(accounts[6]);
    expect(account6Balance.toNumber()).to.eql(100);
  });

  it("should allow a user to send tokens to their multisig");
});
