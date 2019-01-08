import { configureChai } from "@joincivil/dev-utils";
import { BigNumber } from "bignumber.js";

import * as chai from "chai";

configureChai(chai);
const expect = chai.expect;

const MultiSigWalletFactory = artifacts.require("MultiSigWalletFactory");
const CivilTokenController = artifacts.require("CivilTokenController");
const Newsroom = artifacts.require("Newsroom");
const NewsroomFactory = artifacts.require("NewsroomFactory");
const CreateNewsroomInGroup = artifacts.require("CreateNewsroomInGroup");

// needed for proof of use tests
const CVLToken = artifacts.require("CVLToken");
const CivilPLCRVoting = artifacts.require("CivilPLCRVoting");
const AttributeStore = artifacts.require("AttributeStore");
const DLL = artifacts.require("DLL");

/*
MANAGERS - addresses that are allowed to add and remove addresses from lists
CORE - addresses that are controller by Civil Foundation, Civil Media, or Civil Newsrooms
CIVILIAN - addresses that have completed the tutorial
UNLOCKED - addresses that have completed "proof of use" requirements
VERIFIED - addresses that have completed KYC verification
STOREFRONT - addresses that will sell tokens on behalf of the Civil Foundation. these addresses can only transfer to VERIFIED users
*/
contract("CivilTokenController", accounts => {
  const SUPER_ADMIN = accounts[0];
  const MANAGER = accounts[1];
  const MANAGER2 = accounts[2];
  const CORE_CONTRACT = accounts[3];
  const NEW_USER = accounts[4];
  const NEW_USER2 = accounts[5];
  const CIVILIAN_USER = accounts[5];
  const UNLOCKED_USER = accounts[6];
  const VERIFIED_USER = accounts[7];
  const STOREFRONT_WALLET = accounts[8];

  let multiSigWalletFactory: any;
  let newsroomFactory: any;
  let createNewsroomInGroup: any;
  let controller: any;
  beforeEach(async () => {
    multiSigWalletFactory = await MultiSigWalletFactory.new();
    newsroomFactory = await NewsroomFactory.new(multiSigWalletFactory.address);
    controller = await CivilTokenController.new();
    createNewsroomInGroup = await CreateNewsroomInGroup.new(newsroomFactory.address, controller.address);
    await controller.addManager(createNewsroomInGroup.address);
    await controller.addManager(MANAGER);
    await controller.addToCore(SUPER_ADMIN);
    await controller.addToCore(CORE_CONTRACT);
    await controller.addToCivilians(CIVILIAN_USER);
    await controller.addToCivilians(UNLOCKED_USER);
    await controller.addToUnlocked(UNLOCKED_USER);
    await controller.addToVerified(VERIFIED_USER);
    await controller.addToStorefront(STOREFRONT_WALLET);
  });

  describe("Managers", () => {
    it("should allow Owner to add Managers", async () => {
      await controller.addManager(MANAGER2);
      const isManager = await controller.checkManagerStatus.call(MANAGER);
      expect(isManager).to.eql(true);
    });
    it("should not allow Managers to add Managers", async () => {
      await controller.addManager(MANAGER);
      await expect(controller.addManager(MANAGER2, { from: MANAGER })).to.eventually.be.rejected();

      const isManager = await controller.checkManagerStatus.call(MANAGER2);

      expect(isManager).to.eql(false);
    });

    it("should allow Managers to ADD or REMOVE addresses from lists", async () => {
      await controller.addManager(MANAGER);
      // ADD
      await controller.addToCore(NEW_USER, { from: MANAGER });
      await controller.addToCivilians(NEW_USER, { from: MANAGER });
      await controller.addToUnlocked(NEW_USER, { from: MANAGER });
      await controller.addToVerified(NEW_USER, { from: MANAGER });
      await controller.addToStorefront(NEW_USER, { from: MANAGER });

      // REMOVE
      await controller.removeFromCore(NEW_USER, { from: MANAGER });
      await controller.removeFromCivilians(NEW_USER, { from: MANAGER });
      await controller.removeFromUnlocked(NEW_USER, { from: MANAGER });
      await controller.removeFromVerified(NEW_USER, { from: MANAGER });
      await controller.removeFromStorefront(NEW_USER, { from: MANAGER });
    });
    it("should not allow Others to ADD or REMOVE addresses from LISTS", async () => {
      await expectFailure(controller.addToCore(NEW_USER, { from: NEW_USER2 }));
      await expectFailure(controller.addToCivilians(NEW_USER, { from: NEW_USER2 }));
      await expectFailure(controller.addToUnlocked(NEW_USER, { from: NEW_USER2 }));
      await expectFailure(controller.addToVerified(NEW_USER, { from: NEW_USER2 }));
      await expectFailure(controller.addToStorefront(NEW_USER, { from: NEW_USER2 }));

      await expectFailure(controller.removeFromCore(NEW_USER, { from: NEW_USER2 }));
      await expectFailure(controller.removeFromCivilians(NEW_USER, { from: NEW_USER2 }));
      await expectFailure(controller.removeFromUnlocked(NEW_USER, { from: NEW_USER2 }));
      await expectFailure(controller.removeFromVerified(NEW_USER, { from: NEW_USER2 }));
      await expectFailure(controller.removeFromStorefront(NEW_USER, { from: NEW_USER2 }));
    });
  });

  describe("Non-Civilians", () => {
    it("should prevent SEND to anyone", async () => {
      await expectTransferCode(controller.detectTransferRestriction.call(NEW_USER, NEW_USER2, 1), 1);
      await expectTransferCode(controller.detectTransferRestriction.call(NEW_USER, CORE_CONTRACT, 1), 1);
      await expectTransferCode(controller.detectTransferRestriction.call(NEW_USER, MANAGER, 1), 1);
    });
  });

  describe("Civilians", () => {
    it("should allow SEND to CORE list", async () => {
      await expectTransferCode(controller.detectTransferRestriction.call(CIVILIAN_USER, CORE_CONTRACT, 1), 0);
    });
    it("should prevent SEND to anyone else", async () => {
      await expectTransferCode(controller.detectTransferRestriction.call(CIVILIAN_USER, NEW_USER2, 1), 2);
      await expectTransferCode(controller.detectTransferRestriction.call(CIVILIAN_USER, MANAGER, 1), 2);
    });
  });

  describe("Unlocked Civilians", () => {
    it("should allow SEND to anybody", async () => {
      await expectTransferCode(controller.detectTransferRestriction.call(UNLOCKED_USER, CORE_CONTRACT, 1), 0);
      await expectTransferCode(controller.detectTransferRestriction.call(UNLOCKED_USER, CIVILIAN_USER, 1), 0);
      await expectTransferCode(controller.detectTransferRestriction.call(UNLOCKED_USER, STOREFRONT_WALLET, 1), 0);
      await expectTransferCode(controller.detectTransferRestriction.call(UNLOCKED_USER, MANAGER, 1), 0);
      await expectTransferCode(controller.detectTransferRestriction.call(UNLOCKED_USER, NEW_USER, 1), 0);
      await expectTransferCode(controller.detectTransferRestriction.call(UNLOCKED_USER, NEW_USER2, 1), 0);
    });
  });

  describe("Storefront", () => {
    it("should allow SEND to VERIFIED and CORE list", async () => {
      await expectTransferCode(controller.detectTransferRestriction.call(STOREFRONT_WALLET, VERIFIED_USER, 1), 0);
      await expectTransferCode(controller.detectTransferRestriction.call(STOREFRONT_WALLET, CORE_CONTRACT, 1), 0);
    });
    it("should prevent SEND to anyone else", async () => {
      await expectTransferCode(controller.detectTransferRestriction.call(STOREFRONT_WALLET, NEW_USER, 1), 3);
      await expectTransferCode(controller.detectTransferRestriction.call(STOREFRONT_WALLET, CIVILIAN_USER, 1), 3);
      await expectTransferCode(controller.detectTransferRestriction.call(STOREFRONT_WALLET, UNLOCKED_USER, 1), 3);
      await expectTransferCode(controller.detectTransferRestriction.call(STOREFRONT_WALLET, MANAGER, 1), 3);
    });
  });

  describe("Newsrooms", () => {
    let newsroom: any;
    let newsroomMultisig: any;
    beforeEach(async () => {
      const name = "Test Newsroom";
      const charterUri = "http://civil.co";
      const charterHash = web3.sha3("foo");
      const initialOwners = [MANAGER];
      const initialRequired = 1;
      await createNewsroomInGroup.create(name, charterUri, charterHash, initialOwners, initialRequired);
      const newsroomAddress = await newsroomFactory.instantiations.call(createNewsroomInGroup.address, 0);
      newsroom = await Newsroom.at(newsroomAddress);
      newsroomMultisig = await newsroom.owner.call();
    });
    it("should allow CIVILIANS to send to NEWSROOM MULTISIGS", async () => {
      await expectTransferCode(controller.detectTransferRestriction.call(CIVILIAN_USER, newsroomMultisig, 1), 0);
    });
    it("should allow NEWSROOM MULTISIGS to send to CIVILIANS", async () => {
      await expectTransferCode(controller.detectTransferRestriction.call(newsroomMultisig, CIVILIAN_USER, 1), 0);
    });
    it("should allow NEWSROOM MULTISIGS to send to CORE", async () => {
      await expectTransferCode(controller.detectTransferRestriction.call(newsroomMultisig, CORE_CONTRACT, 1), 0);
    });
    it("should prevent SEND from NEWSROOM MULTISIGS to send to anyone else", async () => {
      await expectTransferCode(controller.detectTransferRestriction.call(newsroomMultisig, NEW_USER, 1), 2);
    });
  });

  describe("Proof of Use", () => {
    it("should have PLCR add CIVILIANS to UNLOCKED list using Telemetry", async () => {
      const token = await CVLToken.new(new BigNumber(10000), "TestCoin", "18", "TEST", controller.address);
      await token.transfer(CIVILIAN_USER, 1000);
      CivilPLCRVoting.link(AttributeStore);
      CivilPLCRVoting.link(DLL);
      const plcr = await CivilPLCRVoting.new(token.address, controller.address);
      await token.approve(plcr.address, 200, { from: CIVILIAN_USER });
      await controller.addManager(plcr.address);
      await controller.addToCore(plcr.address);
      await plcr.requestVotingRights(100, { from: CIVILIAN_USER });
      const ok = await controller.unlockedList(CIVILIAN_USER);

      expect(ok).to.be.true();
    });
  });
});

async function expectFailure(p: Promise<any>): Promise<any> {
  let caught: boolean = false;
  try {
    await p;
  } catch (e) {
    caught = true;
  }

  if (!caught) {
    throw new Error("was expecting an error to be thrown");
  }
}

async function expectTransferCode(p: Promise<any>, expectedCode: number): Promise<any> {
  const code = await p;

  if (code.toNumber() !== expectedCode) {
    throw new Error(`was expecting code to be ${expectedCode} but it is ${code}`);
  }
}
