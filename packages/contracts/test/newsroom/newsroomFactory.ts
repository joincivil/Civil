import * as chai from "chai";
import * as Web3 from "web3";
import { configureChai } from "@joincivil/dev-utils";
import { promisify } from "@joincivil/utils";
import { REVERTED } from "../utils/constants";

const Newsroom = artifacts.require("Newsroom");
const MultiSigWallet = artifacts.require("MultiSigWallet");
const MultiSigWalletFactory = artifacts.require("MultiSigWalletFactory");
const NewsroomFactory = artifacts.require("NewsroomFactory");

configureChai(chai);
const expect = chai.expect;

const CONTRACT_EVENT = "ContractInstantiation";
const NEWSROOM_NAME = "Newsroom name";

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

  async function createNewsroom(
    owners: string[],
    required: number = 1,
    name: string = NEWSROOM_NAME,
  ): Promise<{newsroom: any, multisig: any}> {
    const receipt = await instance.create(name, owners, required);
    return {
      newsroom: Newsroom.at(createdContract(instance, receipt)),
      multisig: MultiSigWallet.at(createdContract(multisigFactoryInstance, receipt)),
    };
  }

  before(async () => {
    multisigFactoryInstance = await MultiSigWalletFactory.new();
  });

  beforeEach(async () => {
    instance = await NewsroomFactory.new(multisigFactoryInstance.address);
  });

  // TODO(ritave): Due to having a construction parameter, the code differs from the expected deployedBytecode,
  // find out why.
  it("creates a newsroom");

  it("creates a multisig", async () => {
    const { multisig } = await createNewsroom([owner]);

    await codeMatches(multisig, MultiSigWallet);
  });

  it("tranfers ownership to multisig", async () => {
    const { newsroom, multisig } = await createNewsroom([owner]);

    await expect(newsroom.owner()).to.eventually.be.equal(multisig.address);
  });

  it("sets proper owners", async () => {
    const OWNERS = [owner, thirdOwner];

    const { multisig } = await createNewsroom(OWNERS);

    await expect(multisig.getOwners()).to.eventually.have.members(OWNERS);
  });

  it("sets proper required", async () => {
    const OWNERS = [owner, secondOwner, thirdOwner];
    const REQUIRED = 2;

    const { multisig } = await createNewsroom(OWNERS, REQUIRED);

    await expect(multisig.required()).to.eventually.be.bignumber.equal(REQUIRED);
  });

  it("registers newsroom", async () => {
    const { newsroom } = await createNewsroom([owner]);

    await expect(instance.isInstantiation(newsroom.address)).to.eventually.be.true();
  });

  it("registers multisig", async () => {
    const { multisig } = await createNewsroom([owner]);

    await expect(multisigFactoryInstance.isInstantiation(multisig.address)).to.eventually.be.true();
  });

  it("sets the name properly", async () => {
    const MY_NAME = "my name";

    const { newsroom } = await createNewsroom([owner], 1, MY_NAME);

    expect(await newsroom.name()).to.be.equal(MY_NAME);
  });

  it("doesn't allow empty names", async () => {
    await expect(instance.create("", [owner], 1)).to.eventually.be.rejectedWith(REVERTED);
  });

  it("checks required amount", async () => {
    await expect(instance.create(NEWSROOM_NAME, [owner], 2)).to.eventually.be.rejectedWith(REVERTED);
  });
});
