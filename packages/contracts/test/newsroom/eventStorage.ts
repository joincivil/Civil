import { configureChai } from "@joincivil/dev-utils";
import { keccak256String } from "@joincivil/utils";
import * as chai from "chai";
import { events } from "../utils/constants";
import { configureProviders, findEvent } from "../utils/contractutils";

const EventStorage = artifacts.require("EventStorage");
configureProviders(EventStorage);

configureChai(chai);
const expect = chai.expect;

const SOME_DATA = "this is test data, please ignore";
const SOME_DATA_2 = "this is more data for testing, also ignore";
const SOME_DATA_HASH = keccak256String(SOME_DATA);

contract("Newsroom", (accounts: string[]) => {
  let eventStorage: any;

  beforeEach(async () => {
    eventStorage = await EventStorage.new();
  });

  describe("store", () => {
    it("fires an event", async () => {
      const receipt = await eventStorage.store(SOME_DATA);
      const event = findEvent(receipt, events.EVENTSTORAGE_STORED);

      expect(receipt.logs).to.be.length(1);

      expect(event).to.not.be.null();
      expect(event!.args.data).to.be.equal(SOME_DATA);
    });

    it("allows multiple stores", async () => {
      const firstReceipt = await eventStorage.store(SOME_DATA);
      const secondReceipt = await eventStorage.store(SOME_DATA_2);

      const firstEvent = findEvent(firstReceipt, events.EVENTSTORAGE_STORED);
      const secondEvent = findEvent(secondReceipt, events.EVENTSTORAGE_STORED);

      expect(firstEvent).to.not.be.null();
      expect(secondEvent).to.not.be.null();

      expect(firstEvent!.args.data).to.be.equal(SOME_DATA);
      expect(secondEvent!.args.data).to.be.equal(SOME_DATA_2);
    });

    it("allows duplicate data", async () => {
      const firstReceipt = await eventStorage.store(SOME_DATA);
      const secondReceipt = await eventStorage.store(SOME_DATA);

      const firstEvent = findEvent(firstReceipt, events.EVENTSTORAGE_STORED);
      const secondEvent = findEvent(secondReceipt, events.EVENTSTORAGE_STORED);

      expect(firstEvent).to.not.be.null();
      expect(secondEvent).to.not.be.null();

      expect(firstEvent!.args.data).to.be.equal(SOME_DATA);
      expect(firstEvent!.args.data).to.be.equal(secondEvent!.args.data);
      expect(firstEvent!.args.dataHash).to.be.equal(secondEvent!.args.dataHash);
    });

    it("calculates the hash properly", async () => {
      const receipt = await eventStorage.store(SOME_DATA);
      const event = findEvent(receipt, events.EVENTSTORAGE_STORED);

      expect(event).to.not.be.null();

      expect(event!.args.dataHash).to.be.equal(SOME_DATA_HASH);
    });
  });
});
