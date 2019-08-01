import { fetchItem, removeItem, setItem } from "@joincivil/utils";

const SESSION_KEY = "apollo_session";

// TODO(jon): Get network from civil.currentProvider
const NETWORK_KEY = "network";

import { IAuthLoginResponse } from "../types";

export function getApolloSessionKey(): string {
  const network = getNetwork();
  return `${SESSION_KEY}-${network}`;
}

export function getApolloSession(): IAuthLoginResponse | null {
  const sessionKey = getApolloSessionKey();
  return fetchItem(sessionKey);
}

export function setApolloSession(session: IAuthLoginResponse): void {
  const sessionKey = getApolloSessionKey();
  setItem(sessionKey, session);
}

export function clearApolloSession(): void {
  const sessionKey = getApolloSessionKey();
  removeItem(sessionKey);
}

export function getNetwork(): number {
  const network = fetchItem(NETWORK_KEY);
  if (network) {
    return network;
  } else {
    return 1;
  }
}

export function setNetworkValue(network: number): void {
  setItem(NETWORK_KEY, network);
}
