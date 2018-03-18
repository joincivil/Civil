import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

const Newsroom = artifacts.require("Newsroom");
const MultiSigWalletFactory = artifacts.require("MultiSigWalletFactory");
const NewsroomFactory = artifacts.require("NewsroomFactory");

configureChai(chai);
const expect = chai.expect;

contract("NewsroomFactory", (accounts) => {
  let multisigFactoryInstance: any;
  let instance: any;

  before(async () => {
    multisigFactoryInstance = await MultiSigWalletFactory.new();
  });

  beforeEach(async () => {
    instance = await NewsroomFactory.new(multisigFactoryInstance.address);
  });

  it("creates a newsroom");
  it("creates a multisig");
  it("sets proper owners");
  it("sets proper required");
  it("tranfers ownership to multisig");
  it("registers newsroom");
  it("registers multisig");
});
