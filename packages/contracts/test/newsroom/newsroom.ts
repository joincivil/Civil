import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";
import { promisify, prepareNewsroomMessage } from "@joincivil/utils";
import { soliditySHA3 } from "ethereumjs-abi";
import { bufferToHex } from "ethereumjs-util";

import { events, NEWSROOM_ROLE_EDITOR, REVERTED } from "../utils/constants";
import { findEvent, idFromEvent } from "../utils/contractutils";

const Newsroom = artifacts.require("Newsroom");

configureChai(chai);
const expect = chai.expect;

const FIRST_NEWSROOM_NAME = "TEST NAME, PLEASE IGNORE";
const SOME_URI = "http://thiistest.uri";
const SOME_HASH = web3.sha3();

contract("Newsroom", (accounts: string[]) => {
  const defaultAccount = accounts[0];
  let newsroom: any;

  beforeEach(async () => {
    newsroom = await Newsroom.new(FIRST_NEWSROOM_NAME);
  });

  describe("publishRevision", () => {
    it("forbids empty uris", async () => {
      await newsroom.addRole(defaultAccount, NEWSROOM_ROLE_EDITOR);
      await expect(newsroom.publishRevision("", SOME_HASH)).to.be.rejectedWith(REVERTED);
    });

    it("finishes", async () => {
      await newsroom.addRole(defaultAccount, NEWSROOM_ROLE_EDITOR);
      await expect(newsroom.publishRevision(SOME_URI, SOME_HASH)).to.eventually.be.fulfilled();
    });

    it("creates an event", async () => {
      const tx = await newsroom.publishRevision(SOME_URI, SOME_HASH);
      const event = findEvent(tx, events.NEWSROOM_PUBLISHED);
      expect(event).to.not.be.undefined();
      expect(event!.args.editor).to.be.equal(defaultAccount);
    });

    it("succeeds with editor role", async () => {
      await newsroom.addRole(accounts[1], NEWSROOM_ROLE_EDITOR);

      const tx = await newsroom.publishRevision(SOME_URI, SOME_HASH, { from: accounts[1] });
      const id = idFromEvent(tx);

      const [hash, uri] = await newsroom.content(id);
      expect(uri).to.be.equal(SOME_URI);
      expect(hash).to.be.equal(`${SOME_HASH}`);
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
  });

  describe("setName", () => {
    it("sets the name in constructor", async () => {
      const name = await newsroom.name();
      expect(name).to.be.equal(FIRST_NEWSROOM_NAME);
    });

    it("can't set empty name", async () => {
      await expect(newsroom.setName("")).to.eventually.be.rejectedWith(REVERTED);
    });

    it("changes name", async () => {
      const NEW_NAME = "new name here";

      expect(await newsroom.name()).to.be.equal(FIRST_NEWSROOM_NAME);

      await newsroom.setName(NEW_NAME);

      expect(await newsroom.name()).to.be.equal(NEW_NAME);
    });

    it("can't be used by non-owner", async () => {
      await expect(newsroom.setName("something", { from: accounts[1] })).to.eventually.be.rejectedWith(REVERTED);
    });

    it("fires an event", async () => {
      const receipt = await newsroom.setName("something");

      const event = findEvent(receipt, "NameChanged");

      expect(event).to.not.be.null();
    });
  });

  describe("publishRevisionSigned", () => {
    const [, editor, author] = accounts;
    const signAsync = promisify<string>(web3.eth.sign, web3.eth);

    let MESSAGE: string;
    let SIGNATURE: string;

    beforeEach(async () => {
      MESSAGE = prepareNewsroomMessage(newsroom.address, SOME_HASH);
      SIGNATURE = await signAsync(author, MESSAGE);
      await newsroom.addRole(editor, NEWSROOM_ROLE_EDITOR);
    });

    it("fails without editor role", async () => {
      await expect(
        newsroom.publishRevisionSigned(SOME_URI, SOME_HASH, author, SIGNATURE, { from: author }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    it("succeeds with an editor role", async () => {
      await expect(
        newsroom.publishRevisionSigned(SOME_URI, SOME_HASH, author, SIGNATURE, { from: editor }),
      ).to.eventually.be.fulfilled();
    });

    it("fails without proper signature", async () => {
      const WRONG_SIG = await signAsync(editor, MESSAGE);
      await expect(
        newsroom.publishRevisionSigned(SOME_URI, SOME_HASH, author, WRONG_SIG, { from: editor }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    it("fires RevisionPublished event", async () => {
      const receipt = await newsroom.publishRevisionSigned(SOME_URI, SOME_HASH, author, SIGNATURE, { from: editor });

      const event = findEvent(receipt, events.NEWSROOM_PUBLISHED);

      expect(event).to.not.be.null();
      expect(event!.args.editor).to.be.equal(editor);
      expect(event!.args.uri).to.be.equal(SOME_URI);
    });

    it("fires RevisionSigned event", async () => {
      const receipt = await newsroom.publishRevisionSigned(SOME_URI, SOME_HASH, author, SIGNATURE, { from: editor });

      const event = findEvent(receipt, events.NEWSROOM_SIGNED);

      expect(event).to.not.be.null();
      expect(event!.args.editor).to.be.equal(editor);
      expect(event!.args.author).to.be.equal(author);
    });

    it("has the same id in published and signed events", async () => {
      const receipt = await newsroom.publishRevisionSigned(SOME_URI, SOME_HASH, author, SIGNATURE);

      const publishedEvent = findEvent(receipt, events.NEWSROOM_PUBLISHED);
      const signedEvent = findEvent(receipt, events.NEWSROOM_SIGNED);

      expect(publishedEvent).to.not.be.null();
      expect(signedEvent).to.not.be.null();
      expect(publishedEvent!.args.id).to.be.bignumber.equal(signedEvent!.args.id);
    });
  });
});
