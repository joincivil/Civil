import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { configureProviders } from "../utils/contractutils";

const UserGroups = artifacts.require("UserGroups");
const GroupTokenController = artifacts.require("GroupTokenController");
const Whitelist = artifacts.require("Whitelist");
configureProviders(UserGroups, GroupTokenController, Whitelist);

configureChai(chai);
const expect = chai.expect;

contract("GroupTokenController", accounts => {
  const [owner] = accounts;
  const group1 = accounts.slice(1, 5);
  const group2 = accounts.slice(5, 9);
  const restAccounts = accounts.slice(9);

  let whitelist: any;
  let userGroups: any;
  let controller: any;

  beforeEach(async () => {
    whitelist = await Whitelist.new();
    userGroups = await UserGroups.new(whitelist.address);
    controller = await GroupTokenController.new(userGroups.address);
  });

  it("disallows transfer betwen two no-groups addresses", async () => {
    await expect(controller.transferAllowed(accounts[1], accounts[2])).to.eventually.be.false();
  });

  it("allows transfers in global group");
  it("allows super group to send to anyone");
  it("allows anyone to send to super group");
  it("allows to send to global group after proving use");
  it("doesn't allow to send to non-global address after proving use");

  context("with full groups", () => {
    beforeEach(async () => {
      for (const group of [group1, group2]) {
        await userGroups.allowInGroupTransfers(group[0], group[1]);
        await userGroups.allowInGroupTransfers(group[2], group[3]);
        await userGroups.allowInGroupTransfers(group[0], group[2]);
      }
    });

    it("allows transfers within group", async () => {
      for (const group of [group1, group2]) {
        for (const a of group) {
          for (const b of group) {
            await expect(controller.transferAllowed(a, b)).to.eventually.be.true();
          }
        }
      }
    });

    it("disallows transfer between groups", async () => {
      for (const a of group1) {
        for (const b of group2) {
          await expect(controller.transferAllowed(a, b)).to.eventually.be.false();
          await expect(controller.transferAllowed(b, a)).to.eventually.be.false();
        }
      }
    });

    it("disallows transfer from no-group address", async () => {
      const [noGroupAddress] = restAccounts;
      for (const [a] of [group1, group2]) {
        await expect(controller.transferAllowed(a, noGroupAddress)).to.eventually.be.false();
        await expect(controller.transferAllowed(noGroupAddress, a)).to.eventually.be.false();
      }
    });
  });
});
