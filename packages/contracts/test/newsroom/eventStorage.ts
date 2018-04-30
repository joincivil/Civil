import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { events } from "../utils/constants";
import { findEvent } from "../utils/contractutils";

const EventStorage = artifacts.require("EventStorage");

configureChai(chai);
const expect = chai.expect;

const SOME_DATA = "this is test data, please ignore";
const SOME_DATA_2 = "this is more data for testing, also ignore";

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
      expect(event!.args.id).to.be.bignumber.equal(0);
      expect(event!.args.data).to.be.equal(SOME_DATA);
    });

    it("allows multiple stores", async () => {
      const firstReceipt = await eventStorage.store(SOME_DATA);
      const secondReceipt = await eventStorage.store(SOME_DATA_2);

      const firstEvent = findEvent(firstReceipt, events.EVENTSTORAGE_STORED);
      const secondEvent = findEvent(secondReceipt, events.EVENTSTORAGE_STORED);

      expect(firstEvent).to.not.be.null();
      expect(secondEvent).to.not.be.null();

      const expectedId = firstEvent!.args.id.add(1);

      expect(secondEvent!.args.id).be.bignumber.equal(expectedId);
      expect(secondEvent!.args.data).to.be.equal(SOME_DATA_2);
    });
  });
});
