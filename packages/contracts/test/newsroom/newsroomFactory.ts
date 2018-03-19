import * as chai from "chai";
import * as Web3 from "web3";
import { configureChai } from "@joincivil/dev-utils";
import { promisify } from "@joincivil/utils";

const Newsroom = artifacts.require("Newsroom");
const MultiSigWallet = artifacts.require("MultiSigWallet");
const MultiSigWalletFactory = artifacts.require("MultiSigWalletFactory");
const NewsroomFactory = artifacts.require("NewsroomFactory");

configureChai(chai);
const expect = chai.expect;

const CONTRACT_EVENT = "ContractInstantiation";

function createdContract(factory: any, txReceipt: Web3.TransactionReceipt): string {
  const myLog = txReceipt.logs.find(
    (log: any) => log.event === CONTRACT_EVENT && log.address === factory.address,
  ) as Web3.DecodedLogEntry<any>|undefined;

  if (!myLog) {
    throw new Error("ContractInstantation log not found");
  }
  return myLog.args.instantiation;
}

const getCode = promisify<string>(web3.eth.getCode);
// TODO(ritave): Make this into mocha extension
async function codeMatches(instance: any, clazz: any): Promise<void> {
  const code = await getCode(instance.address);
  expect(code).to.be.equal(clazz.deployedBytecode);
}

contract("NewsroomFactory", (accounts) => {
  const [owner, secondOwner, thirdOwner] = accounts;

  let multisigFactoryInstance: any;
  let instance: any;

  before(async () => {
    multisigFactoryInstance = await MultiSigWalletFactory.new();
  });

  beforeEach(async () => {
    instance = await NewsroomFactory.new(multisigFactoryInstance.address);
  });

  it("creates a newsroom", async () => {
    const receipt = await instance.create([owner], 1);
    const newsroom = Newsroom.at(createdContract(instance, receipt));

    await codeMatches(newsroom, Newsroom);
  });

  it("creates a multisig", async () => {
    const receipt = await instance.create([owner], 1);
    const multisig = MultiSigWallet.at(createdContract(multisigFactoryInstance, receipt));

    await codeMatches(multisig, MultiSigWallet);
  });

  it("tranfers ownership to multisig", async () => {
    const receipt = await instance.create([owner], 1);
    const newsroom = Newsroom.at(createdContract(instance, receipt));
    const multisig = MultiSigWallet.at(createdContract(multisigFactoryInstance, receipt));

    await expect(newsroom.owner()).to.eventually.be.equal(multisig.address);
  });

  it("sets proper owners", async () => {
    const OWNERS = [owner, thirdOwner];

    const receipt = await instance.create(OWNERS, 1);
    const multisig = MultiSigWallet.at(createdContract(multisigFactoryInstance, receipt));

    await expect(multisig.getOwners()).to.eventually.have.members(OWNERS);
  });

  it("sets proper required", async () => {
    const OWNERS = [owner, secondOwner, thirdOwner];
    const REQUIRED = 2;

    const receipt = await instance.create(OWNERS, REQUIRED);
    const multisig = MultiSigWallet.at(createdContract(multisigFactoryInstance, receipt));

    await expect(multisig.required()).to.eventually.be.bignumber.equal(REQUIRED);
  });

  it("registers newsroom", async () => {
    const receipt = await instance.create([owner], 1);
    const newsroom = MultiSigWallet.at(createdContract(instance, receipt));

    await expect(instance.isInstantiation(newsroom.address)).to.eventually.be.true();
  });

  it("registers multisig", async () => {
    const receipt = await instance.create([owner], 1);
    const multisig = MultiSigWallet.at(createdContract(multisigFactoryInstance, receipt));

    await expect(multisigFactoryInstance.isInstantiation(multisig.address)).to.eventually.be.true();
  });
});
