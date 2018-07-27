import { configureChai } from "@joincivil/dev-utils";
import { is0x0Address, prepareNewsroomMessage, promisify } from "@joincivil/utils";
import BigNumber from "bignumber.js";
import * as chai from "chai";
import { events, NEWSROOM_ROLE_EDITOR, REVERTED } from "../utils/constants";
import { findEvent } from "../utils/contractutils";

const Newsroom = artifacts.require("Newsroom");

configureChai(chai);
const expect = chai.expect;

const FIRST_NEWSROOM_NAME = "TEST NAME, PLEASE IGNORE";
const SOME_URI = "http://thiistest.uri";
const SOME_HASH = web3.sha3();

const signAsync = promisify<string>(web3.eth.sign, web3.eth);
const getBlockAsync = promisify<any>(web3.eth.getBlock, web3.eth);

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
    newsroom = await Newsroom.new(FIRST_NEWSROOM_NAME, SOME_URI, SOME_HASH);
  });

  it("allows for empty charter", async () => {
    await expect(Newsroom.new(FIRST_NEWSROOM_NAME, "", "")).to.eventually.be.fulfilled();
  });

  describe("publishContent", () => {
    it("finishes", async () => {
      await newsroom.addRole(defaultAccount, NEWSROOM_ROLE_EDITOR);
      await expect(newsroom.publishContent(SOME_URI, SOME_HASH, "", "")).to.eventually.be.fulfilled();
    });

    it("creates an event", async () => {
      const tx = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "");
      const event = findEvent(tx, events.NEWSROOM_PUBLISHED);
      expect(event).to.not.be.undefined();
      expect(event!.args.editor).to.be.equal(defaultAccount);
    });

    it("succeeds with editor role", async () => {
      await newsroom.addRole(accounts[1], NEWSROOM_ROLE_EDITOR);

      const tx = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "", { from: accounts[1] });
      const id = idFromEvent(tx);

      const [hash, uri] = await newsroom.getContent(id);

      expect(uri).to.be.equal(SOME_URI);
      expect(hash).to.be.equal(`${SOME_HASH}`);
    });

    describe("with author signature", () => {
      let MESSAGE: string;
      let SIGNATURE: string;

      beforeEach(async () => {
        MESSAGE = prepareNewsroomMessage(newsroom.address, SOME_HASH);
        SIGNATURE = await signAsync(author, MESSAGE);
        await newsroom.addRole(editor, NEWSROOM_ROLE_EDITOR);
      });

      it("fails without proper signature", async () => {
        const WRONG_SIG = await signAsync(editor, MESSAGE);
        await expect(
          newsroom.publishContent(SOME_URI, SOME_HASH, author, WRONG_SIG, { from: editor }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });

      it("fires RevisionSigned event", async () => {
        const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, author, SIGNATURE, { from: editor });

        const event = findEvent(receipt, events.NEWSROOM_SIGNED);

        expect(event).to.not.be.null();
        expect(event!.args.author).to.be.equal(author);
      });

      it("has the same ids in published, signed and updated events", async () => {
        const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, author, SIGNATURE);

        const publishedEvent = findEvent(receipt, events.NEWSROOM_PUBLISHED);
        const signedEvent = findEvent(receipt, events.NEWSROOM_SIGNED);
        const updatedEvent = findEvent(receipt, events.NEWSROOM_UPDATED);

        expect(publishedEvent).to.not.be.null();
        expect(signedEvent).to.not.be.null();
        expect(updatedEvent).to.not.be.null();

        expect(publishedEvent!.args.contentId).to.be.bignumber.equal(signedEvent!.args.contentId);
        expect(updatedEvent!.args.contentId).to.be.bignumber.equal(publishedEvent!.args.contentId);

        expect(updatedEvent!.args.revisionId).to.be.bignumber.equal(signedEvent!.args.revisionId);
      });

      it("doesn't allow signature and 0x0 author", async () => {
        await expect(newsroom.publishContent(SOME_URI, SOME_HASH, "0x0", SIGNATURE)).to.be.rejected.with(REVERTED);
      });

      it("doesn't allow empty signature and an author", async () => {
        await expect(newsroom.publishContent(SOME_URI, SOME_HASH, author, "")).to.be.rejected.with(REVERTED);
      });
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

  describe("updateRevision", () => {
    const SECOND_URI = "http://thisIsSecondUri.com";
    const SECOND_HASH = web3.sha3("Some content");

    beforeEach(async () => {
      await newsroom.addRole(editor, NEWSROOM_ROLE_EDITOR);
    });

    describe("without author signature", () => {
      let contentId: BigNumber;

      beforeEach(async () => {
        const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "", { from: editor });
        const event = findEvent(receipt, events.NEWSROOM_PUBLISHED);
        expect(event).to.not.be.null();
        contentId = event!.args.contentId;
      });

      it("can't update the charter if you're not an owner", async () => {
        await expect(
          newsroom.updateRevision(0, SECOND_URI, SECOND_HASH, "", { from: editor }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });

      it("works for charter if you're the owner", async () => {
        await expect(
          newsroom.updateRevision(0, SECOND_URI, SECOND_HASH, "", { from: defaultAccount }),
        ).to.eventually.be.fulfilled();
      });

      it("can't update non-existing content", async () => {
        await expect(
          newsroom.updateRevision(999, SECOND_URI, SECOND_HASH, "", { from: editor }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });

      it("requires editor role", async () => {
        await expect(
          newsroom.updateRevision(contentId, SECOND_URI, SECOND_HASH, "", { from: author }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });

      it("fires RevisionUpdated event", async () => {
        const receipt = await newsroom.updateRevision(contentId, SECOND_URI, SECOND_HASH, "", { from: editor });

        const event = findEvent(receipt, events.NEWSROOM_UPDATED);

        expect(event).to.not.be.null();
        expect(event!.args.editor).to.be.equal(editor);
        expect(event!.args.contentId).to.be.bignumber.equal(contentId);
        expect(event!.args.revisionId).to.be.bignumber.equal(1);
        expect(event!.args.uri).to.be.equal(SECOND_URI);
      });

      it("increases revision count", async () => {
        expect(await newsroom.revisionCount(contentId)).to.be.bignumber.equal(1);

        await newsroom.updateRevision(contentId, SECOND_URI, SECOND_HASH, "", { from: editor });

        expect(await newsroom.revisionCount(contentId)).to.be.bignumber.equal(2);
      });
    });

    describe("with author signature", () => {
      let MESSAGE: string;
      let SIGNATURE: string;

      let contentId: BigNumber;

      beforeEach(async () => {
        MESSAGE = prepareNewsroomMessage(newsroom.address, SOME_HASH);
        SIGNATURE = await signAsync(author, MESSAGE);
        const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, author, SIGNATURE, { from: editor });
        const event = findEvent(receipt, events.NEWSROOM_PUBLISHED);
        expect(event).to.not.be.null();
        contentId = event!.args.contentId;
      });

      it("requires signature from the same author", async () => {
        const message = prepareNewsroomMessage(newsroom.address, SOME_HASH);
        const editorSignature = await signAsync(editor, message);

        await expect(
          newsroom.updateRevision(contentId, SOME_URI, SOME_HASH, editorSignature),
        ).to.eventually.be.rejectedWith(REVERTED);
      });

      it("allows unsigned revisions", async () => {
        expect(await newsroom.isContentSigned(contentId)).to.be.true();

        await newsroom.updateRevision(contentId, SOME_URI, SOME_HASH, "");

        expect(await newsroom.isContentSigned(contentId)).to.be.false();
        expect(await newsroom.isRevisionSigned(contentId, 0)).to.be.true();
      });

      it("doesn't allow signing if the first revision was unsigned", async () => {
        const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "", { from: editor });
        const event = findEvent(receipt, events.NEWSROOM_PUBLISHED);
        const secondContentId = event!.args.contentId;

        await expect(
          newsroom.updateRevision(secondContentId, SOME_URI, SOME_HASH, SIGNATURE),
        ).to.eventually.be.rejectedWith(REVERTED);
      });
    });
  });

  describe("isContentSigned", () => {
    it("returns true on signed content", async () => {
      const message = prepareNewsroomMessage(newsroom.address, SOME_HASH);
      const signature = await signAsync(author, message);
      const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, author, signature);
      const contentId = idFromEvent(receipt);

      expect(await newsroom.isContentSigned(contentId)).to.be.true();
    });

    it("returns false on non-signed content", async () => {
      const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "");
      const contentId = idFromEvent(receipt);

      expect(await newsroom.isContentSigned(contentId)).to.be.false();
    });

    it("works with multiple revisions", async () => {
      const message = prepareNewsroomMessage(newsroom.address, SOME_HASH);
      const signature = await signAsync(author, message);
      const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, author, signature);
      const contentId = idFromEvent(receipt);

      await newsroom.updateRevision(contentId, SOME_URI, SOME_HASH, signature);

      expect(await newsroom.isContentSigned(contentId)).to.be.true();
    });
  });

  describe("getContent", () => {
    it("returns proper data", async () => {
      const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "");

      const block = await getBlockAsync(receipt.receipt.blockNumber);
      const contentId = idFromEvent(receipt);

      const [hash, uri, timestamp, returnedAuthor, signature] = await newsroom.getContent(contentId);

      expect(uri).to.be.equal(SOME_URI);
      expect(hash).to.be.equal(SOME_HASH);
      expect(timestamp).to.be.bignumber.equal(block.timestamp);
      expect(is0x0Address(returnedAuthor)).to.be.ok();
      expect(signature).to.be.equal("0x");
    });

    it("returns signed data", async () => {
      const MESSAGE = prepareNewsroomMessage(newsroom.address, SOME_HASH);
      const SIGNATURE = await signAsync(author, MESSAGE);
      const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, author, SIGNATURE);

      const contentId = idFromEvent(receipt);

      const [, , , returnedAuthor, signature] = await newsroom.getContent(contentId);

      expect(returnedAuthor).to.be.equal(author);
      expect(signature).to.be.equal(SIGNATURE);
    });

    it("returns zeros on on non-existing content", async () => {
      const [hash, uri, timestamp, retAuthor, signature] = await newsroom.getContent(999);
      expect(is0x0Address(hash)).to.be.ok();
      expect(uri).to.be.empty();
      expect(timestamp).to.be.bignumber.equal(0);
      expect(retAuthor).to.be.equal("0x");
      expect(signature).to.be.equal("0x");
    });

    it("returns latest revision", async () => {
      const SECOND_URI = "http://anotheruri.com";
      const SECOND_HASH = web3.sha3("Some test content");

      const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "");
      const contentId = idFromEvent(receipt);

      const updateReceipt = await newsroom.updateRevision(contentId, SECOND_URI, SECOND_HASH, "");
      const block = await getBlockAsync(updateReceipt.receipt.blockNumber);

      const [hash, uri, timestamp] = await newsroom.getContent(contentId);

      expect(uri).to.be.equal(SECOND_URI);
      expect(hash).to.be.equal(SECOND_HASH);
      expect(timestamp).to.be.bignumber.equal(block.timestamp);
    });
  });

  describe("getRevision", () => {
    it("returns proper data", async () => {
      const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "");

      const block = await getBlockAsync(receipt.receipt.blockNumber);
      const contentId = idFromEvent(receipt);

      const [hash, uri, timestamp] = await newsroom.getRevision(contentId, 0);

      expect(uri).to.be.equal(SOME_URI);
      expect(hash).to.be.equal(SOME_HASH);
      expect(timestamp).to.be.bignumber.equal(block.timestamp);
    });

    it("returns zeros on non-existing content", async () => {
      const [hash, uri, timestamp, retAuthor, signature] = await newsroom.getRevision(999, 0);
      expect(is0x0Address(hash)).to.be.ok();
      expect(uri).to.be.empty();
      expect(timestamp).to.be.bignumber.equal(0);
      expect(retAuthor).to.be.equal("0x");
      expect(signature).to.be.equal("0x");
    });

    it("returns latest revision", async () => {
      const SECOND_URI = "http://anotheruri.com";
      const SECOND_HASH = web3.sha3("Some test content");

      const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "");
      const contentId = idFromEvent(receipt);

      const updateReceipt = await newsroom.updateRevision(contentId, SECOND_URI, SECOND_HASH, "");
      const block = await getBlockAsync(updateReceipt.receipt.blockNumber);

      const [hash, uri, timestamp] = await newsroom.getRevision(contentId, 1);

      expect(uri).to.be.equal(SECOND_URI);
      expect(hash).to.be.equal(SECOND_HASH);
      expect(timestamp).to.be.bignumber.equal(block.timestamp);
    });

    it("returns previous revision", async () => {
      const SECOND_URI = "http://anotheruri.com";
      const SECOND_HASH = web3.sha3("Some test content");

      const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "");
      const block = await getBlockAsync(receipt.receipt.blockNumber);

      const contentId = idFromEvent(receipt);

      await newsroom.updateRevision(contentId, SECOND_URI, SECOND_HASH, "");

      const [hash, uri, timestamp] = await newsroom.getRevision(contentId, 0);

      expect(uri).to.be.equal(SOME_URI);
      expect(hash).to.be.equal(SOME_HASH);
      expect(timestamp).to.be.bignumber.equal(block.timestamp);
    });

    it("returns zeros on non-existing revision", async () => {
      const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "");

      const contentId = idFromEvent(receipt);

      const [hash, uri, timestamp, retAuthor, signature] = await newsroom.getRevision(contentId, 999);
      expect(is0x0Address(hash)).to.be.ok();
      expect(uri).to.be.empty();
      expect(timestamp).to.be.bignumber.equal(0);
      expect(retAuthor).to.be.equal("0x");
      expect(signature).to.be.equal("0x");
    });
  });

  describe("signRevision", () => {
    let contentId: BigNumber;
    let MESSAGE: string;
    let SIGNATURE: string;

    beforeEach(async () => {
      MESSAGE = prepareNewsroomMessage(newsroom.address, SOME_HASH);
      SIGNATURE = await signAsync(author, MESSAGE);
      await newsroom.addRole(editor, NEWSROOM_ROLE_EDITOR);
    });

    describe("with no publishing author", () => {
      beforeEach(async () => {
        const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, "", "", { from: editor });
        const event = findEvent(receipt, events.NEWSROOM_PUBLISHED);
        expect(event).to.not.be.null();
        contentId = event!.args.contentId;
      });

      it("doesn't allow to add signature with 0x0 author", async () => {
        await expect(newsroom.signRevision(contentId, 0, "", SIGNATURE)).to.be.eventually.rejectedWith(REVERTED);
      });

      it("allows to update author", async () => {
        const receipt = await newsroom.signRevision(contentId, 0, author, SIGNATURE);
        const event = findEvent(receipt, events.NEWSROOM_SIGNED);

        const [, , , newAuthor] = await newsroom.getContent(contentId);

        expect(event).to.not.be.null();
        expect(event!.args.contentId).to.be.bignumber.equal(contentId);
        expect(event!.args.revisionId).to.be.bignumber.equal(0);
        expect(event!.args.author).to.be.equal(author);

        expect(newAuthor).to.be.equal(author);
      });

      it("requires proper signature", async () => {
        const wrongSignature = await signAsync(editor, MESSAGE);

        await expect(newsroom.signRevision(contentId, 0, author, wrongSignature)).to.eventually.be.rejectedWith(
          REVERTED,
        );
      });

      it("requires editor role", async () => {
        await expect(
          newsroom.signRevision(contentId, 0, author, SIGNATURE, { from: author }),
        ).to.eventually.be.rejectedWith(REVERTED);
      });
    });

    describe("with an existing author", () => {
      beforeEach(async () => {
        const receipt = await newsroom.publishContent(SOME_URI, SOME_HASH, author, SIGNATURE, { from: editor });
        const event = findEvent(receipt, events.NEWSROOM_PUBLISHED);
        expect(event).to.not.be.null();
        contentId = event!.args.contentId;
      });

      it("doesn't allow to add 0x0 author", async () => {
        await expect(newsroom.signRevision(contentId, 0, "0x0", SIGNATURE)).to.eventually.be.rejectedWith(REVERTED);
      });

      it("doesn't allow to unsign revision", async () => {
        await expect(newsroom.signRevision(contentId, 0, "0x0", "")).to.eventually.be.rejectedWith(REVERTED);
      });

      it("allows to backsign an unsigned revisision", async () => {
        await newsroom.updateRevision(contentId, SOME_URI, SOME_HASH, "", { from: editor });

        expect(await newsroom.isContentSigned(contentId)).to.be.false();

        await newsroom.signRevision(contentId, 1, author, SIGNATURE);

        expect(await newsroom.isContentSigned(contentId)).to.be.true();
      });
    });
  });
});
