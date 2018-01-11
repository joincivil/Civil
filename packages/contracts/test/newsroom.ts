import * as chai from "chai";
import { events, REVERTED } from "../utils/constants";
import ChaiConfig from "./utils/chaiconfig";
import { findEvent, idFromEvent, is0x0Address, timestampFromTx } from "./utils/contractutils";

const Newsroom = artifacts.require("Newsroom");

ChaiConfig();
const expect = chai.expect;

const SOME_URI = "http://thiistest.uri";

contract("Newsroom", (accounts: string[]) => {
  const defaultAccount = accounts[0];
  let newsroom: any;

  before(async () => {
    newsroom = await Newsroom.deployed();
  });

  describe("author", () => {
    let id: any;

    beforeEach(async () => {
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
  });

  describe("approveContent", () => {
    let id: any;

    beforeEach(async () => {
      const tx = await newsroom.proposeContent(SOME_URI);
      id = idFromEvent(tx);
    });

    it("allows approving", async () => {
      await expect(newsroom.approveContent(id)).to.eventually.be.fulfilled();
    });

    it("forbids not owners", async () => {
      await expect(
        newsroom.approveContent(id, { from: accounts[1] }))
        .to.be.rejectedWith(REVERTED);
    });

    it("fires an event", async () => {
      const tx = await newsroom.approveContent(id);
      const event = findEvent(tx, events.NEWSROOM_APPROVED);

      expect(event).to.not.be.undefined();
    });

    it("can't reapprove", async () => {
      await newsroom.approveContent(id);

      await expect(newsroom.approveContent(id)).to.be.rejectedWith(REVERTED);
    });

    it("can't deny after", async () => {
      await newsroom.approveContent(id);

      await expect(newsroom.denyContent(id)).to.be.rejectedWith(REVERTED);
    });

    it("fails on non-existent id", async () => {
      await expect(newsroom.approveContent(9999)).to.be.rejectedWith(REVERTED);
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
    });

    it("forbids not owners", async () => {
      await expect(
        newsroom.denyContent(id, { from: accounts[1] }))
        .to.be.rejectedWith(REVERTED);
    });

    it("fires an event", async () => {
      const tx = await newsroom.denyContent(id);
      const event = findEvent(tx, events.NEWSROOM_DENIED);

      expect(event).to.not.be.undefined();
    });

    it("can't readeny", async () => {
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
  });
});
