import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { createHttpLink, HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { EthSignedMessage, EthAddress } from "@joincivil/typescript-types";
import { fetchItem, setItem, removeItem } from "./localStorage";

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
  removeItem(SESSION_KEY + "-" + network);
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

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.warn(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      });
    }

    if (networkError) {
      // @ts-ignore: `networkError` type is incorrect - it's just set to `Error` but it in fact has various fields
      const response = networkError.result;
      if (response) {
        if (response.errCode === "EXPIRED_TOKEN") {
          // @TODO(tobek) Use refresh token to get a new JWT. Do we need to flush the cache?
          clearApolloSession();
          return;
        } else if (response.errCode === "INVALID_TOKEN") {
          // Something went wrong, just clear and assume logged out. @TODO(tobek) Do we need to flush cache?
          clearApolloSession();
          return;
        }
      }
      console.warn(`[Network error]: ${networkError}`);
    }
  });

  client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });

  return client;
}

const loggedInQuery = gql`
  query {
    currentUser {
      uid
    }
  }
`;
export async function isLoggedIn(): Promise<boolean> {
  if (!client || !getApolloSession()) {
    return false;
  }

  try {
    const res = await client.query({
      query: loggedInQuery,
    });
    return !res.errors && !!res.data;
  } catch {
    return false;
  }
}
