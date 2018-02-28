import * as chai from "chai";
import { ACL_TEST_ROLE, events, REVERTED } from "../utils/constants";
import ChaiConfig from "./utils/chaiconfig";
import { findEvent } from "./utils/contractutils";

const ACL = artifacts.require("test/DummyACL");

ChaiConfig();
const expect = chai.expect;

contract("ACL", (accounts: string[]) => {
  const defaultAccount = accounts[0];
  let acl: any;

  beforeEach(async () => {
    acl = await ACL.new();
  });

  describe("hasRole", () => {
    it("owner without role added doesn't have the role", async () => {
      expect(await acl.hasRole(defaultAccount, ACL_TEST_ROLE)).to.be.false();
    });

    it("returns false when no role", async () => {
      expect(await acl.hasRole(accounts[1], ACL_TEST_ROLE)).to.be.false();
    });

    it("returns true when added to role", async () => {
      await acl.addRole(accounts[1], ACL_TEST_ROLE);

      expect(await acl.hasRole(accounts[1], ACL_TEST_ROLE)).to.be.true();
    });
  });

  describe("addRole", () => {
    it("works from superuser", async () => {
      const SOME_ROLE = "some role, please ignore";
      await acl.addRole(defaultAccount, SOME_ROLE);

      expect(await acl.hasRole(defaultAccount, SOME_ROLE));
    });

    it("fails without proper role", async () => {
      const addRole = acl.addRole(accounts[1], ACL_TEST_ROLE, { from: accounts[1] });
      await expect(addRole).to.eventually.be.rejectedWith(REVERTED);
    });

    it("works from TEST_ROLE", async () => {
      const SOME_ROLE = "some role, please ignore";
      expect(await acl.hasRole(accounts[2], SOME_ROLE)).to.be.false();
      await acl.addRole(accounts[1], ACL_TEST_ROLE);

      const addRole = acl.addRole(accounts[2], SOME_ROLE, { from: accounts[1] });

      await expect(addRole).to.eventually.be.fulfilled();
      expect(await acl.hasRole(accounts[2], SOME_ROLE)).to.be.true();
    });

    it("returns an event", async () => {
      const tx = await acl.addRole(accounts[1], ACL_TEST_ROLE);
      const event = findEvent(tx, events.ACL_ROLE_ADDED);

      expect(event).to.not.be.null();
      expect(event.args.granter).to.be.equal(defaultAccount);
      expect(event.args.grantee).to.be.equal(accounts[1]);
      expect(event.args.role).to.be.equal(ACL_TEST_ROLE);
    });

    it("doesn't crash when double adding", async () => {
      await acl.addRole(defaultAccount, ACL_TEST_ROLE);

      await expect(acl.addRole(defaultAccount, ACL_TEST_ROLE)).to.eventually.be.fulfilled();
    });
  });

  describe("removeRole", () => {
    it("removes a role", async () => {
      await acl.addRole(defaultAccount, ACL_TEST_ROLE);
      expect(await acl.hasRole(defaultAccount, ACL_TEST_ROLE)).to.be.true();

      await acl.removeRole(defaultAccount, ACL_TEST_ROLE);

      expect(await acl.hasRole(defaultAccount, ACL_TEST_ROLE)).to.be.false();
    });

    it("removes non-existen role", async () => {
      expect(await acl.hasRole(defaultAccount, ACL_TEST_ROLE)).to.be.false();

      await expect(acl.removeRole(defaultAccount, ACL_TEST_ROLE)).to.eventually.be.fulfilled();
      expect(await acl.hasRole(defaultAccount, ACL_TEST_ROLE)).to.be.false();
    });

    it("doesn't work without TEST_ROLE access", async () => {
      await acl.addRole(defaultAccount, ACL_TEST_ROLE);

      const removeRole = acl.removeRole(defaultAccount, ACL_TEST_ROLE, { from: accounts[1] });
      await expect(removeRole).to.eventually.be.rejectedWith(REVERTED);
    });

    it("works with TEST_ROLE access", async () => {
      await acl.addRole(accounts[1], ACL_TEST_ROLE);
      await acl.addRole(defaultAccount, ACL_TEST_ROLE);
      expect(await acl.hasRole(defaultAccount, ACL_TEST_ROLE)).to.be.true();

      await acl.removeRole(defaultAccount, ACL_TEST_ROLE, { from: accounts[1] });

      expect(await acl.hasRole(defaultAccount, ACL_TEST_ROLE)).to.be.false();
    });

    it("allows you to remove your own role", async () => {
      await acl.addRole(accounts[1], ACL_TEST_ROLE);

      const removeRole = acl.removeRole(accounts[1], ACL_TEST_ROLE, { from: accounts[1] });

      await expect(removeRole).to.eventually.be.fulfilled();
      expect(await acl.hasRole(accounts[1], ACL_TEST_ROLE)).to.be.false();
    });

    it("allows to remove role somebody else added", async () => {
      const SOME_ROLE = "test role, please ignore";
      await acl.addRole(accounts[1], SOME_ROLE);
      await acl.addRole(accounts[2], ACL_TEST_ROLE);

      const removeRole = acl.removeRole(accounts[1], SOME_ROLE, { from: accounts[2] });
      await expect(removeRole).to.eventually.be.fulfilled();
      expect(await acl.hasRole(accounts[1], SOME_ROLE)).to.be.false();
    });

    it("fires an event", async () => {
      const SOME_ROLE = "test role, please ignore";
      await acl.addRole(accounts[1], SOME_ROLE);

      const tx = await acl.removeRole(accounts[1], SOME_ROLE);
      const event = findEvent(tx, events.ACL_ROLE_REMOVED);

      expect(event).to.not.be.null();
      expect(event.args.granter).to.be.equal(defaultAccount);
      expect(event.args.grantee).to.be.equal(accounts[1]);
      expect(event.args.role).to.be.equal(SOME_ROLE);
    });
  });
});
