import * as chai from "chai";
import { events, NEWSROOM_ROLE_EDITOR, NEWSROOM_ROLE_REPORTER, REVERTED } from "../utils/constants";
import ChaiConfig from "./utils/chaiconfig";
import { findEvent, idFromEvent, is0x0Address, timestampFromTx } from "./utils/contractutils";

const Newsroom = artifacts.require("Newsroom");

ChaiConfig();
const expect = chai.expect;

const SOME_URI = "http://thiistest.uri";

contract("Newsroom", (accounts: string[]) => {
  const defaultAccount = accounts[0];
  let newsroom: any;

  beforeEach(async () => {
    newsroom = await Newsroom.new();
  });

  describe("author", () => {
    let id: any;

    beforeEach(async () => {
      await newsroom.addRole(accounts[1], NEWSROOM_ROLE_REPORTER);
      const tx = await newsroom.proposeContent(SOME_URI, { from: accounts[1] });
      id = idFromEvent(tx);
    });

    it("returns 0x0 on non-existent content", async () => {
      const is0x0 = is0x0Address(await newsroom.author(9999));
      expect(is0x0).to.be.true();
    });

    it("returns proper author", async () => {
      await expect(
        newsroom.author(id, { from: defaultAccount })).to.eventually.be.equal(accounts[1]);
    });

    it("works for approved content", async () => {
      await newsroom.approveContent(id);

      await expect(newsroom.author(id)).to.eventually.be.equal(accounts[1]);
    });

    it("returns 0x0 on denied content", async () => {
      await newsroom.denyContent(id);

      const is0x0 = is0x0Address(await newsroom.author(id));
      expect(is0x0).to.be.true();
    });
  });

  describe("uri", () => {
    let id: any;

    beforeEach(async () => {
      const tx = await newsroom.proposeContent(SOME_URI);
      id = idFromEvent(tx);
    });

    it("returns empty string on non-existen content", async () => {
      await expect(newsroom.uri(9999)).to.eventually.be.equal("");
    });

    it("returns proper uri", async () => {
      await expect(newsroom.uri(id)).to.eventually.be.equal(SOME_URI);
    });

    it("works on approved content", async () => {
      await newsroom.approveContent(id);

      await expect(newsroom.uri(id)).to.eventually.be.equal(SOME_URI);
    });

    it("returns empty string on denied content", async () => {
      await newsroom.denyContent(id);

      await expect(newsroom.uri(id)).to.eventually.be.equal("");
    });
  });

  describe("timestamp", () => {
    let id: any;
    let timestamp: any;

    beforeEach(async () => {
      const tx = await newsroom.proposeContent(SOME_URI);
      id = idFromEvent(tx);
      timestamp = await timestampFromTx(web3, tx.receipt);
    });

    it("returns proper timestamp", async () => {
      expect(timestamp).not.to.be.bignumber.equal(0);

      await expect(newsroom.timestamp(id)).to.eventually.be.bignumber.equal(timestamp);
    });

    it("works for approved content", async () => {
      await newsroom.approveContent(id);

      await expect(newsroom.timestamp(id)).to.eventually.be.bignumber.equal(timestamp);
    });

    it("returns zero on not existent content", async () => {
      await expect(newsroom.timestamp(9999)).to.eventually.be.bignumber.equal(0);
    });

    it("returns zero on denied content", async () => {
      await newsroom.denyContent(id);

      await expect(newsroom.timestamp(id)).to.eventually.be.bignumber.equal(0);
    });
  });

  describe("isProposed", () => {
    let id: any;

    beforeEach(async () => {
      const tx = await newsroom.proposeContent(SOME_URI);
      id = idFromEvent(tx);
    });

    it("returns true on proposed content", async () => {
      await expect(newsroom.isProposed(id)).to.eventually.be.true();
    });

    it("returns false on approved content", async () => {
      await newsroom.approveContent(id);

      await expect(newsroom.isProposed(id)).to.eventually.be.false();
    });

    it("returns false on non-existen content", async () => {
      await expect(newsroom.isProposed(9999)).to.eventually.be.false();
    });

    it("returns false on denied content", async () => {
      await newsroom.denyContent(id);

      await expect(newsroom.isProposed(id)).to.eventually.be.false();
    });
  });

  describe("isApproved", () => {
    let id: any;

    beforeEach(async () => {
      const tx = await newsroom.proposeContent(SOME_URI);
      id = idFromEvent(tx);
    });

    it("returns false on proposed content", async () => {
      await expect(newsroom.isApproved(id)).to.eventually.be.false();
    });

    it("returns true on approved content", async () => {
      await newsroom.approveContent(id);

      await expect(newsroom.isApproved(id)).to.eventually.be.true();
    });

    it("returns false on non-existen content", async () => {
      await expect(newsroom.isProposed(9999)).to.eventually.be.false();
    });

    it("returns false on denied content", async () => {
      await newsroom.denyContent(id);

      await expect(newsroom.isProposed(id)).to.eventually.be.false();
    });
  });

  describe("proposeContent", () => {
    it("forbids empty uris", async () => {
      await expect(newsroom.proposeContent("")).to.be.rejectedWith(REVERTED);
    });

    it("finishes", async () => {
      await expect(newsroom.proposeContent(SOME_URI)).to.eventually.be.fulfilled();
    });

    it("creates an event", async () => {
      const tx = await newsroom.proposeContent(SOME_URI);
      const event = findEvent(tx, events.NEWSROOM_PROPOSED);
      expect(event).to.not.be.undefined();
      expect(event.args.author).to.be.equal(defaultAccount);
    });

    it("fails without reporter role", async () => {
      const proposeContent = newsroom.proposeContent(SOME_URI, { from: accounts[1] });

      await expect(proposeContent).to.eventually.be.rejectedWith(REVERTED);
    });

    it("succeeds with reporter role", async () => {
      await newsroom.addRole(accounts[1], NEWSROOM_ROLE_REPORTER);

      const tx = await newsroom.proposeContent(SOME_URI, { from: accounts[1] });
      const id = idFromEvent(tx);

      expect(await newsroom.isProposed(id)).to.be.true();
    });
  });

  describe("approveContent", () => {
    let id: any;

    beforeEach(async () => {
      const tx = await newsroom.proposeContent(SOME_URI);
      id = idFromEvent(tx);
    });

    it("allows approving", async () => {
      await expect(newsroom.approveContent(id)).to.eventually.be.fulfilled();
      expect(await newsroom.isApproved(id)).to.be.true();
    });

    it("doesn't work without editor role", async () => {
      await expect(
        newsroom.approveContent(id, { from: accounts[1] }))
        .to.be.rejectedWith(REVERTED);
      expect(await newsroom.isApproved(id)).to.be.false();
    });

    it("fires an event", async () => {
      const tx = await newsroom.approveContent(id);
      const event = findEvent(tx, events.NEWSROOM_APPROVED);

      expect(event).to.not.be.undefined();
      expect(event.args.id).to.be.bignumber.equal(id);
    });

    it("can't reapprove", async () => {
      await newsroom.approveContent(id);

      await expect(newsroom.approveContent(id)).to.be.rejectedWith(REVERTED);
      expect(await newsroom.isApproved(id)).to.be.true();
    });

    it("can't deny after", async () => {
      await newsroom.approveContent(id);

      await expect(newsroom.denyContent(id)).to.be.rejectedWith(REVERTED);
      expect(await newsroom.isApproved(id)).to.be.true();
    });

    it("fails on non-existent id", async () => {
      await expect(newsroom.approveContent(9999)).to.be.rejectedWith(REVERTED);
    });

    it("doesn't work with only reporter role", async () => {
      await newsroom.addRole(accounts[1], NEWSROOM_ROLE_REPORTER);

      const approveContent = newsroom.approveContent(id, { from: accounts[1] });
      await expect(approveContent).to.eventually.be.rejectedWith(REVERTED);
    });

    it("works with editor role", async () => {
      await newsroom.addRole(accounts[1], NEWSROOM_ROLE_EDITOR);

      const approveContent = newsroom.approveContent(id, { from: accounts[1] });

      await expect(approveContent).to.eventually.be.fulfilled();
      expect(await newsroom.isApproved(id)).to.be.true();
    });
  });

  describe("denyContent", () => {
    let id: any;

    beforeEach(async () => {
      const tx = await newsroom.proposeContent(SOME_URI);
      id = idFromEvent(tx);
    });

    it("allows denying", async () => {
      await expect(newsroom.denyContent(id)).to.eventually.be.fulfilled();
      expect(await newsroom.isApproved(id)).to.be.false();
      expect(await newsroom.isProposed(id)).to.be.false();
    });

    it("doesn't work without role", async () => {
      await expect(
        newsroom.denyContent(id, { from: accounts[1] }))
        .to.be.rejectedWith(REVERTED);
    });

    it("fires an event", async () => {
      const tx = await newsroom.denyContent(id);
      const event = findEvent(tx, events.NEWSROOM_DENIED);

      expect(event).to.not.be.undefined();
      expect(event.args.id).to.be.bignumber.equal(id);
    });

    it("can't re-deny", async () => {
      await newsroom.denyContent(id);

      await expect(newsroom.denyContent(id)).to.be.rejectedWith(REVERTED);
    });

    it("can't approve after", async () => {
      await newsroom.denyContent(id);

      await expect(newsroom.approveContent(id)).to.be.rejectedWith(REVERTED);
    });

    it("fails on non-existent id", async () => {
      await expect(newsroom.denyContent(9999)).to.be.rejectedWith(REVERTED);
    });

    it("doesn't work with only reporter role", async () => {
      await newsroom.addRole(accounts[1], NEWSROOM_ROLE_REPORTER);

      const denyContent = newsroom.denyContent(id, { from: accounts[1] });
      await expect(denyContent).to.eventually.be.rejectedWith(REVERTED);
    });

    it("works with editor role", async () => {
      await newsroom.addRole(accounts[1], NEWSROOM_ROLE_EDITOR);

      const denyContent = newsroom.denyContent(id, { from: accounts[1] });

      await expect(denyContent).to.eventually.be.fulfilled();
      expect(await newsroom.isApproved(id)).to.be.false();
      expect(await newsroom.isProposed(id)).to.be.false();
    });
  });

  describe("addDirector", () => {
    it("grants superuser", async () => {
      await newsroom.addDirector(accounts[1]);

      expect(await newsroom.isSuperuser(accounts[1])).to.be.true();
    });

    it("doesn't work without superuser", async () => {
      const addDirector = newsroom.addDirector(accounts[1], { from: accounts[1] });

      await expect(addDirector).to.eventually.be.rejectedWith(REVERTED);
    });

    it("does work with superuser", async () => {
      await expect(newsroom.addDirector(accounts[1])).to.eventually.be.fulfilled();
      expect(await newsroom.isSuperuser(accounts[1])).to.be.true();
    });

    it("grants super powers", async () => {
      await newsroom.addDirector(accounts[1]);

      const tx = await newsroom.proposeContent(SOME_URI, { from: accounts[1] });
      const id = idFromEvent(tx);

      expect(await newsroom.isProposed(id)).to.be.true();

      await newsroom.approveContent(id);

      expect(await newsroom.isApproved(id)).to.be.true();
    });
  });

  describe("removeDirector", () => {
    beforeEach(async () => {
      await newsroom.addDirector(accounts[1]);
    });

    it("allows to remove somebody else", async () => {
      expect(await newsroom.isSuperuser(accounts[1])).to.be.true();

      await newsroom.removeDirector(accounts[1]);

      expect(await newsroom.isSuperuser(accounts[1])).to.be.false();
    });

    it("allows to remove oneself", async () => {
      expect(await newsroom.isSuperuser(defaultAccount)).to.be.true();

      await newsroom.removeDirector(defaultAccount);

      expect(await newsroom.isSuperuser(defaultAccount)).to.be.false();
    });

    it("removes super powers", async () => {
      await newsroom.removeDirector(defaultAccount);

      await expect(newsroom.proposeContent(SOME_URI)).to.eventually.be.rejectedWith(REVERTED);

      const tx = await newsroom.proposeContent(SOME_URI, { from: accounts[1] });
      const id = idFromEvent(tx);
      await newsroom.removeDirector(accounts[1], { from: accounts[1] });

      const approveContent = newsroom.approveContent(id, { from: accounts[1] });
      await expect(approveContent).to.eventually.be.rejectedWith(REVERTED);
    });

    it("doesn't work without superpowers", async () => {
      await newsroom.addRole(accounts[2], NEWSROOM_ROLE_EDITOR);

      const removeDirector = newsroom.removeDirector(defaultAccount, { from: accounts[2] });

      await expect(removeDirector).to.eventually.be.rejectedWith(REVERTED);
    });
  });

  describe("addRole", () => {
    beforeEach(async () => {
      await newsroom.addRole(accounts[1], NEWSROOM_ROLE_EDITOR);
    });

    it("works with superpowers", async () => {
      const addRole = newsroom.addRole(accounts[2], NEWSROOM_ROLE_EDITOR);

      await expect(addRole).to.eventually.be.fulfilled();
      expect(await newsroom.hasRole(accounts[2], NEWSROOM_ROLE_EDITOR)).to.be.true();
    });

    it("works with editor role", async () => {
      const addRole = newsroom.addRole(accounts[2], NEWSROOM_ROLE_EDITOR, { from: accounts[1] });

      await expect(addRole).to.eventually.be.fulfilled();
      expect(await newsroom.hasRole(accounts[2], NEWSROOM_ROLE_EDITOR)).to.be.true();
    });

    it("doesn't work without any role", async () => {
      const addRole = newsroom.addRole(accounts[2], NEWSROOM_ROLE_EDITOR, { from: accounts[2] });

      await expect(addRole).to.eventually.be.rejectedWith(REVERTED);
      expect(await newsroom.hasRole(accounts[2], NEWSROOM_ROLE_EDITOR)).to.be.false();
    });

    it("doesn't work with reporter role", async () => {
      await newsroom.addRole(accounts[2], NEWSROOM_ROLE_REPORTER);
      const addRole = newsroom.addRole(accounts[2], NEWSROOM_ROLE_EDITOR, { from: accounts[2] });

      await expect(addRole).to.eventually.be.rejectedWith(REVERTED);
      expect(await newsroom.hasRole(accounts[2], NEWSROOM_ROLE_REPORTER)).to.be.true();
      expect(await newsroom.hasRole(accounts[2], NEWSROOM_ROLE_EDITOR)).to.be.false();
    });
  });

  describe("removeRole", () => {
    beforeEach(async () => {
      await newsroom.addRole(accounts[1], NEWSROOM_ROLE_EDITOR);
    });

    it("works with superpowers", async () => {
      const removeRole = newsroom.removeRole(accounts[1], NEWSROOM_ROLE_EDITOR);

      await expect(removeRole).to.eventually.be.fulfilled();
      expect(await newsroom.hasRole(accounts[1], NEWSROOM_ROLE_EDITOR)).to.be.false();
    });

    it("works with editor role", async () => {
      const removeRole = newsroom.removeRole(accounts[1], NEWSROOM_ROLE_EDITOR, { from: accounts[1] });

      await expect(removeRole).to.eventually.be.fulfilled();
      expect(await newsroom.hasRole(accounts[1], NEWSROOM_ROLE_EDITOR)).to.be.false();
    });

    it("doesn't work without any role", async () => {
      const removeRole = newsroom.removeRole(accounts[1], NEWSROOM_ROLE_EDITOR, { from: accounts[2] });

      await expect(removeRole).to.eventually.be.rejectedWith(REVERTED);
      expect(await newsroom.hasRole(accounts[1], NEWSROOM_ROLE_EDITOR)).to.be.true();
    });

    it("doesn't work with reporter role", async () => {
      await newsroom.addRole(accounts[2], NEWSROOM_ROLE_REPORTER);
      const removeRole = newsroom.removeRole(accounts[1], NEWSROOM_ROLE_EDITOR, { from: accounts[2] });

      await expect(removeRole).to.eventually.be.rejectedWith(REVERTED);
      expect(await newsroom.hasRole(accounts[1], NEWSROOM_ROLE_EDITOR)).to.be.true();
    });
  });
});
