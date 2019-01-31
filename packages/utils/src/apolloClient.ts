import { ApolloClient } from "apollo-client";
import { createHttpLink, HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { fetchItem, setItem } from "./localStorage";

export interface AuthLoginResponse {
  token: string;
  refreshToken: string;
  uid: string;
}

let client: ApolloClient<NormalizedCacheObject>;

const SESSION_KEY = "apollo_session";
const NETWORK_KEY = "network";

export function getApolloSession(): AuthLoginResponse | null {
  const network = getNetwork();
  return fetchItem(SESSION_KEY + "-" + network);
}

export function setApolloSession(session: AuthLoginResponse): void {
  const network = getNetwork();
  setItem(SESSION_KEY + "-" + network, session);
}

export function clearApolloSession(): void {
  const network = getNetwork();
  setItem(SESSION_KEY + "-" + network, null);
}

export function getNetwork(): number {
  const network = fetchItem(NETWORK_KEY);
  if (network) {
    return network;
  } else {
    return 4; // TODO: change to 1
  }
}

export function setNetworkValue(network: number): void {
  setItem(NETWORK_KEY, network);
}

export function getApolloClient(httpLinkOptions: HttpLink.Options): ApolloClient<NormalizedCacheObject> {
  if (client) {
    return client;
  }

  const httpLink = createHttpLink(httpLinkOptions);

  const authLink = setContext((_: any, { headers }: { headers: any; uri: any }) => {
    const network = getNetwork();
    const authInfo = getApolloSession();
    let uri = "";
    switch (network) {
      case 1:
        uri = "https://graphql.civil.co/v1/query";
        break;
      case 4:
        uri = "https://graphql.staging.civil.app/v1/query";
        break;
      case 50:
        uri = "http://localhost:8080/v1/query";
        break;
    }

    if (authInfo) {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${authInfo.token}`,
        },
        uri,
      };
    }

    return {
      headers,
      uri,
    };
  });

  client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return client;
}
