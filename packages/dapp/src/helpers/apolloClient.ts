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

const SESSION_KEY = "session";

export function getSession(): AuthLoginResponse | null {
  return fetchItem(SESSION_KEY);
}

export function setSession(session: AuthLoginResponse): void {
  setItem(SESSION_KEY, session);
}

export function clearSession(): void {
  setItem(SESSION_KEY, null);
}

export function getClient(httpLinkOptions: HttpLink.Options): ApolloClient<NormalizedCacheObject> {
  if (client) {
    return client;
  }

  const httpLink = createHttpLink(httpLinkOptions);

  const authLink = setContext((_: any, { headers }: { headers: any }) => {
    const authInfo = getSession();

    const token = authInfo ? authInfo.token : null;

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return client;
}
