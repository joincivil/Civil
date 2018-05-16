import { configureChai } from "@joincivil/dev-utils";
import { prepareNewsroomMessage, promisify } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as chai from "chai";
import { NEWSROOM_ROLE_EDITOR, REVERTED, events } from "../utils/constants";
import { findEvent } from "../utils/contractutils";

const Newsroom = artifacts.require("Newsroom");

configureChai(chai);
const expect = chai.expect;

const FIRST_NEWSROOM_NAME = "TEST NAME, PLEASE IGNORE";
const SOME_URI = "http://thiistest.uri";
const SOME_HASH = web3.sha3();

const signAsync = promisify<string>(web3.eth.sign, web3.eth);

export function idFromEvent(tx: any): BigNumber | undefined {
  for (const log of tx.logs) {
    if (log.args.contentId) {
      return log.args.contentId;
    }
  }
  return undefined;
}

contract("Newsroom", (accounts: string[]) => {
  const [defaultAccount, editor, author] = accounts;
  let newsroom: any;

  beforeEach(async () => {
    newsroom = await Newsroom.new(FIRST_NEWSROOM_NAME);
  });

  describe("publishContent", () => {
    it("forbids empty uris", async () => {
      await newsroom.addRole(defaultAccount, NEWSROOM_ROLE_EDITOR);
      await expect(newsroom.publishContent("", SOME_HASH)).to.be.rejectedWith(REVERTED);
    });

    it("finishes", async () => {
      await newsroom.addRole(defaultAccount, NEWSROOM_ROLE_EDITOR);
      await expect(newsroom.publishContent(SOME_URI, SOME_HASH)).to.eventually.be.fulfilled();
    });

    it("creates an event", async () => {
      const tx = await newsroom.publishContent(SOME_URI, SOME_HASH);
      const event = findEvent(tx, events.NEWSROOM_PUBLISHED);
      expect(event).to.not.be.undefined();
      expect(event!.args.editor).to.be.equal(defaultAccount);
    });

    it("succeeds with editor role", async () => {
      await newsroom.addRole(accounts[1], NEWSROOM_ROLE_EDITOR);

      const tx = await newsroom.publishContent(SOME_URI, SOME_HASH, { from: accounts[1] });
      const id = idFromEvent(tx);

      const [hash, uri] = await newsroom.getContent(id);

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

  describe("publishContentSigned", () => {
    let MESSAGE: string;
    let SIGNATURE: string;

    beforeEach(async () => {
      MESSAGE = prepareNewsroomMessage(newsroom.address, SOME_HASH);
      SIGNATURE = await signAsync(author, MESSAGE);
      await newsroom.addRole(editor, NEWSROOM_ROLE_EDITOR);
    });

    it("fails without editor role", async () => {
      await expect(
        newsroom.publishContentSigned(SOME_URI, SOME_HASH, author, SIGNATURE, { from: author }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    it("succeeds with an editor role", async () => {
      await expect(
        newsroom.publishContentSigned(SOME_URI, SOME_HASH, author, SIGNATURE, { from: editor }),
      ).to.eventually.be.fulfilled();
    });

    it("fails without proper signature", async () => {
      const WRONG_SIG = await signAsync(editor, MESSAGE);
      await expect(
        newsroom.publishContentSigned(SOME_URI, SOME_HASH, author, WRONG_SIG, { from: editor }),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    it("fires ContentPublished event", async () => {
      const receipt = await newsroom.publishContentSigned(SOME_URI, SOME_HASH, author, SIGNATURE, { from: editor });

      const event = findEvent(receipt, events.NEWSROOM_PUBLISHED);

      expect(event).to.not.be.null();
      expect(event!.args.editor).to.be.equal(editor);
      expect(event!.args.uri).to.be.equal(SOME_URI);
    });

    it("fires ContentSigned event", async () => {
      const receipt = await newsroom.publishContentSigned(SOME_URI, SOME_HASH, author, SIGNATURE, { from: editor });

      const event = findEvent(receipt, events.NEWSROOM_SIGNED);

      expect(event).to.not.be.null();
      expect(event!.args.author).to.be.equal(author);
    });

    it("has the same id in published and signed events", async () => {
      const receipt = await newsroom.publishContentSigned(SOME_URI, SOME_HASH, author, SIGNATURE);

      const publishedEvent = findEvent(receipt, events.NEWSROOM_PUBLISHED);
      const signedEvent = findEvent(receipt, events.NEWSROOM_SIGNED);

      expect(publishedEvent).to.not.be.null();
      expect(signedEvent).to.not.be.null();
      expect(publishedEvent!.args.contentId).to.be.bignumber.equal(signedEvent!.args.contentId);
    });
  });

  /*
   * Asume there an
   */
  const updateRevisionCommon = (
    publishCall: (contentUri: string, contentHash: string, from: string) => Promise<any>,
    updateCall: (contentId: number, contentUri: string, contentHash: string, from: string) => Promise<any>,
  ) => {
    describe("common revision tests", () => {
      const SECOND_URI = "http://thisIsSecondUri.com";
      const SECOND_HASH = web3.sha3("Some content");

      let contentId: any;

      beforeEach(async () => {
        await newsroom.addRole(editor, NEWSROOM_ROLE_EDITOR);
        const receipt = await publishCall(SOME_URI, SOME_HASH, editor);
        contentId = idFromEvent(receipt);
      });

      it("can't update non-existing content", async () => {
        await expect(updateCall(999, SECOND_URI, SECOND_HASH, editor)).to.eventually.be.rejectedWith(REVERTED);
      });

      it("requires editor role", async () => {
        await expect(updateCall(contentId, SECOND_URI, SECOND_HASH, author)).to.eventually.be.rejectedWith(REVERTED);
      });

      it("fires RevisionUpdated event", async () => {
        const receipt = await updateCall(contentId, SECOND_URI, SECOND_HASH, editor);

        const event = findEvent(receipt, events.NEWSROOM_UPDATED);

        expect(event).to.not.be.null();
        expect(event!.args.editor).to.be.equal(editor);
        expect(event!.args.contentId).to.be.bignumber.equal(contentId);
        expect(event!.args.revisionId).to.be.bignumber.equal(1);
        expect(event!.args.uri).to.be.equal(SECOND_URI);
      });
    });
  };

  describe("updateRevision", () => {
    it("can't update signed revisions", async () => {
      const message = prepareNewsroomMessage(newsroom.address, SOME_HASH);
      const signature = await signAsync(author, message);
      const receipt = await newsroom.publishContentSigned(SOME_URI, SOME_HASH, author, signature);
      const contentId = idFromEvent(receipt);

      await expect(newsroom.updateRevision(contentId, SOME_URI, SOME_HASH)).to.eventually.be.rejectedWith(REVERTED);
    });

    updateRevisionCommon(
      async (contentUri: string, contentHash: string, from: string) =>
        newsroom.publishContent(contentUri, contentHash, { from }),
      async (contentId: number, contentUri: string, contentHash: string, from: string) =>
        newsroom.updateRevision(contentId, contentUri, contentHash, { from }),
    );
  });

  describe("updateContentSigned", () => {
    it("can't update unsigned revisions", async () => {
      const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH);
      const contentId = idFromEvent(receipt);

      const message = prepareNewsroomMessage(newsroom.address, SOME_HASH);
      const signature = await signAsync(author, message);

      await expect(
        newsroom.updateRevisionSigned(contentId, SOME_URI, SOME_HASH, signature),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    it("requires signature from the same author", async () => {
      const message = prepareNewsroomMessage(newsroom.address, SOME_HASH);
      const editorSignature = await signAsync(editor, message);
      const authorSignature = await signAsync(author, message);

      const receipt = await newsroom.publishContentSigned(SOME_URI, SOME_HASH, author, authorSignature);
      const contentId = idFromEvent(receipt);

      await expect(
        newsroom.updateRevisionSigned(contentId, SOME_URI, SOME_HASH, editorSignature),
      ).to.eventually.be.rejectedWith(REVERTED);
    });

    updateRevisionCommon(
      async (contentUri: string, contentHash: string, from: string) => {
        const message = prepareNewsroomMessage(newsroom.address, contentHash);
        const signature = await signAsync(author, message);
        return newsroom.publishContentSigned(contentUri, contentHash, author, signature, { from });
      },
      async (contentId: number, contentUri: string, contentHash: string, from: string) => {
        const message = prepareNewsroomMessage(newsroom.address, contentHash);
        const signature = await signAsync(author, message);
        return newsroom.updateRevisionSigned(contentId, contentUri, contentHash, signature, { from });
      },
    );
  });

  describe("isSigned", () => {
    it("returns true on signed content");
    it("returns false on non-signed content");
    it("works with multiple revisions");
  });
});
