import { configureChai } from "@joincivil/dev-utils";
import { prepareForceUnionMessage, prepareMaxGroupSizeMessage, promisify } from "@joincivil/utils";
import * as chai from "chai";
import { POU_GLOBAL_GROUP, POU_SUPER_GROUP, REVERTED } from "../utils/constants";
import { setUpUserGroups } from "../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const signAsync = promisify(web3.eth.sign, web3.eth);

contract("UserGroups", accounts => {
  const [owner, nonowner] = accounts;
  let userGroups: any;
  let whitelist: any;

  beforeEach(async () => {
    ({ whitelist, userGroups } = await setUpUserGroups(1, owner));
    await whitelist.addAddressToWhitelist(owner);
  });

  describe("forceUnion", () => {
    it("owner can force union", async () => {
      const message = prepareForceUnionMessage(userGroups.address, accounts[1], accounts[2]);
      const signature = await signAsync(owner, message);
      await userGroups.forceUnion(accounts[1], accounts[2], signature, { from: nonowner });
      const [root1] = await userGroups.find(accounts[1]);
      const [root2] = await userGroups.find(accounts[2]);
      expect(root1).to.be.equal(root2);
    });

    it("non-owners can't force union", async () => {
      const message = prepareForceUnionMessage(userGroups.address, accounts[1], accounts[2]);
      const signature = await signAsync(nonowner, message);
      await expect(
        userGroups.forceUnion(accounts[1], accounts[2], signature, { from: owner }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });
  });

  describe("find", () => {
    xit("returns same if no group before", async () => {
      const [root, size] = await userGroups.find(owner);
      expect(root).to.be.equal(owner);
      expect(size).to.be.bignumber.equal(1);
    });

    xit("returns root if given children", async () => {
      const SIZE = 4;
      const group = accounts.slice(1, SIZE);
      for (const groupee of group) {
        await userGroups.forceUnion(owner, groupee);
      }
      const [root, size] = await userGroups.find(owner);
      expect(size).to.be.bignumber.equal(SIZE);
      for (const groupee of group) {
        const [gRoot, gSize] = await userGroups.find(groupee);
        expect(gRoot).to.be.equal(root);
        expect(gSize).to.be.bignumber.equal(SIZE);
      }
    });
  });

  describe("setMaxGroupSize", () => {
    it("owner can change max group size", async () => {
      expect(await userGroups.maxGroupSize()).to.bignumber.equal(4);

      const message = prepareMaxGroupSizeMessage(userGroups.address, 0, 5);
      const signature = await signAsync(owner, message);
      await userGroups.setMaxGroupSize(5, signature, { from: nonowner });

      expect(await userGroups.maxGroupSize()).to.bignumber.equal(5);
    });

    it("non-owners can't change max group size", async () => {
      const message = prepareMaxGroupSizeMessage(userGroups.address, 0, 5);
      const signature = await signAsync(nonowner, message);
      await expect(userGroups.setMaxGroupSize(5, signature, { from: owner })).to.eventually.be.rejectedWith(REVERTED);
    });

    it("max group size takes effect on any new inGroup unions", async () => {
      let message = prepareMaxGroupSizeMessage(userGroups.address, 0, 1);
      let signature = await signAsync(owner, message);
      await userGroups.setMaxGroupSize(1, signature);
      await expect(userGroups.allowInGroupTransfers(accounts[0], accounts[1])).to.be.rejectedWith(REVERTED);

      message = prepareMaxGroupSizeMessage(userGroups.address, 1, 2);
      signature = await signAsync(owner, message);
      await userGroups.setMaxGroupSize(2, signature);
      await userGroups.allowInGroupTransfers(accounts[0], accounts[1]);
      await expect(userGroups.allowInGroupTransfers(accounts[0], accounts[2])).to.be.rejectedWith(REVERTED);
    });

    it("can't re-use signatures", async () => {
      const message = prepareMaxGroupSizeMessage(userGroups.address, 0, 1);
      const signature = await signAsync(owner, message);
      await userGroups.setMaxGroupSize(1, signature);
      await expect(userGroups.setMaxGroupSize(1, signature)).to.be.rejectedWith(REVERTED);
    });
  });

  describe("allowInGroupTransfers", () => {
    xit("doesn't allow adding to super group", async () => {
      await expect(userGroups.allowInGroupTransfers(POU_SUPER_GROUP, accounts[0])).to.be.rejectedWith(REVERTED);
    });
    xit("doesn't allow adding to global group", async () => {
      await expect(userGroups.allowInGroupTransfers(POU_GLOBAL_GROUP, accounts[0])).to.be.rejectedWith(REVERTED);
    });

    // Edge case - the root of global / super group can change if a group is merged into global group that's bigger than it
    // The solution is to find the root of global group and compare that
    xit("checks the root of global group", async () => {
      const bigGroup = accounts.slice(1, 4);
      for (const groupee of bigGroup) {
        await userGroups.allowInGroupTransfers(owner, groupee);
      }
      await userGroups.forceUnion(POU_GLOBAL_GROUP, owner);
      // owner is now global group
      await expect(userGroups.allowInGroupTransfers(owner, accounts[3])).to.be.rejectedWith(REVERTED);
    });

    xit("checks the root of super group", async () => {
      const bigGroup = accounts.slice(1, 3);
      for (const groupee of bigGroup) {
        await userGroups.allowInGroupTransfers(owner, groupee);
      }
      await userGroups.forceUnion(POU_SUPER_GROUP, owner);
      // owner is now super group
      await expect(userGroups.allowInGroupTransfers(owner, accounts[3])).to.be.rejectedWith(REVERTED);
    });
  });

  describe("allowGlobalGroupTransfers", () => {
    it("requires prove of use");
    it("requires 25% prove of use for smaller buyers");
    it("requires 50% prove of use for bigger buyers");

    xit("adds to global group", async () => {
      await userGroups.allowGlobalGroupTransfers(owner);
      const [root1] = await userGroups.find(owner);
      const [root2] = await userGroups.find(POU_GLOBAL_GROUP);
      expect(root1).to.be.equal(root2);
    });
  });
});
