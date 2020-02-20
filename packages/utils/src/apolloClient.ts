import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { createHttpLink, HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { InMemoryCache, NormalizedCacheObject, IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { fetchItem, setItem, removeItem } from "./localStorage";

export interface AuthLoginResponse {
  token: string;
  refreshToken: string;
  uid: string;
}

let client: ApolloClient<NormalizedCacheObject>;

const SESSION_KEY = "apollo_session";
const NETWORK_KEY = "network";

export function getApolloSessionKey(): string {
  const network = getNetwork();
  return `${SESSION_KEY}-${network}`;
}

export function getApolloSession(): AuthLoginResponse | null {
  const sessionKey = getApolloSessionKey();
  return fetchItem(sessionKey);
}

export function setApolloSession(session: AuthLoginResponse): void {
  const sessionKey = getApolloSessionKey();
  setItem(sessionKey, session);
}

export function clearApolloSession(): void {
  const sessionKey = getApolloSessionKey();
  removeItem(sessionKey);
  setTimeout(async () => {
    await resetApolloStore();
  }, 300);
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

/** Don't override explicitly set network value, but if none set, this will do. Handles possible race condition between web3 network change subscription firing vs. our default value for this based on environment. */
export function setDefaultNetworkValue(network: number): void {
  if (fetchItem(NETWORK_KEY)) {
    return;
  }
  setItem(NETWORK_KEY, network);
}

export function getApolloClient(httpLinkOptions: HttpLink.Options = {}): ApolloClient<NormalizedCacheObject> {
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

  const createOmitTypenameLink = new ApolloLink((operation, forward) => {
    if (operation.variables) {
      operation.variables = JSON.parse(JSON.stringify(operation.variables), (key, value) =>
        key === "__typename" ? undefined : value,
      );
    }
    return forward ? forward(operation) : null;
  });

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: [],
      },
    },
  });

  client = new ApolloClient({
    link: ApolloLink.from([createOmitTypenameLink, errorLink, authLink, httpLink]),
    cache: new InMemoryCache({ fragmentMatcher }),
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

export const getCurrentUserQuery = gql`
  query {
    currentUser {
      uid
      email
      ethAddress
      channels {
        role
      }
      userChannel {
        handle
        id
        EmailAddressRestricted
        avatarDataUrl
        tiny72AvatarDataUrl
        stripeCustomerInfo {
          paymentMethods {
            paymentMethodID
            last4Digits
            expMonth
            expYear
            brand
          }
        }
      }
      userChannelAvatarPromptSeen
      userChannelEmailPromptSeen
    }
  }
`;

export async function getCurrentUser(): Promise<any> {
  if (!client || !getApolloSession()) {
    return null;
  }

  try {
    const { errors, data } = await client.query({
      query: getCurrentUserQuery,
    });

    if (errors) {
      return null;
    }

    return (data as any).currentUser;
  } catch (err) {
    console.log("Error in getCurrentUser: ", { err });
    return null;
  }
}

export async function resetApolloStore(): Promise<void> {
  if (!client) {
    return;
  }

  await client.resetStore();
}
