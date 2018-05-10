import { DecodedLogEntryEvent } from "@joincivil/typescript-types";
import { EthApi } from "./ethapi";
import { TimestampedEvent } from "../types";

export function createTimestampedEvent<T extends DecodedLogEntryEvent>(ethApi: EthApi, event: T): TimestampedEvent<T> {
  // tslint:disable-next-line
  return Object.assign({}, event, {
    timestamp: async () => (await ethApi.getBlock(event.blockNumber!)).timestamp,
  });
}
