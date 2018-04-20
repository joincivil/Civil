import { DecodedLogEntryEvent } from "@joincivil/typescript-types";
import { Web3Wrapper } from "./web3wrapper";
import { TimestampedEvent } from "../types";

export function createTimestampedEvent<T extends DecodedLogEntryEvent>(
  web3Wrapper: Web3Wrapper,
  event: T,
): TimestampedEvent<T> {
  // tslint:disable-next-line
  return Object.assign({}, event, {
    timestamp: async () => (await web3Wrapper.getBlock(event.blockNumber!)).timestamp,
  });
}
