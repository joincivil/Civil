import ApolloClient from "apollo-client";
import {
  clearApolloSession,
  setApolloSession,
  getCurrentUserQuery,
  getApolloSession,
  AuthLoginResponse,
} from "@joincivil/utils";
import gql from "graphql-tag";

const authLoginEthMutation = gql`
  mutation($input: UserSignatureInput!) {
    authWeb3: authLoginEth(input: $input) {
      token
      refreshToken
      uid
    }
  }
`;

const authSignupEthMutation = gql`
  mutation($input: UserSignatureInput!) {
    authWeb3: authSignupEth(input: $input) {
      token
      refreshToken
      uid
    }
  }
`;

export interface AuthServiceOptions {
  apolloClient: ApolloClient<any>;
  onAuthChange(currentUser: any): void;
}

export class AuthService {
  public currentUser?: any;
  public loading = false;
  private apolloClient: ApolloClient<any>;
  private onAuthChange: (currentUser?: any) => void;

  constructor(opts: AuthServiceOptions) {
    this.apolloClient = opts.apolloClient;
    this.onAuthChange = opts.onAuthChange;

    setImmediate(() => this.handleInitialState());
  }

  public async handleInitialState(): Promise<void> {
    const existingSession = getApolloSession();
    if (existingSession && this.apolloClient) {
      this.currentUser = await this.fetchCurrentUser();
      if (this.onAuthChange) {
        this.onAuthChange(this.currentUser);
      }
    }
  }

  public getSession(): AuthLoginResponse | null {
    return getApolloSession();
  }

  public logout(): void {
    console.log("AuthService logout");
    clearApolloSession();
    delete this.currentUser;
    if (this.onAuthChange) {
      this.onAuthChange();
    }
  }

  public async authenticate(signature: any): Promise<any> {
    console.log("sending authenticate mutation", signature);
    return this.graphqlLoginSignup(authLoginEthMutation, signature);
  }
  public async signup(signature: any): Promise<any> {
    console.log("sending signup mutation", signature);
    return this.graphqlLoginSignup(authSignupEthMutation, signature);
  }

  public async loginUser(session: any): Promise<void> {
    setApolloSession(session);
    this.currentUser = await this.fetchCurrentUser();
    if (this.onAuthChange) {
      this.onAuthChange(this.currentUser);
    }
  }

  public async fetchCurrentUser(): Promise<void> {
    this.loading = true;
    const result = await this.apolloClient.query({ query: getCurrentUserQuery, fetchPolicy: "no-cache" });
    this.loading = false;

    if (result.errors) {
      throw new Error("error fetching user");
    }
    return result.data.currentUser;
  }

  public async showWeb3Login(): Promise<void> {
    console.error("web3 auth not yet initialized");
  }
  public async showWeb3Signup(): Promise<void> {
    console.error("web3 auth not yet initialized");
  }
  /** If user is logged in, but web3 not enabled, enable it. */
  public ensureLoggedInUserEnabled(): void {
    console.error("web3 auth not yet initialized");
  }
  public setShowWeb3Login(func: () => Promise<void>): void {
    this.showWeb3Login = func;
  }
  public setShowWeb3Signup(func: () => Promise<void>): void {
    this.showWeb3Signup = func;
  }
  public setEnsureLoggedInUserEnabled(func: () => void): void {
    this.ensureLoggedInUserEnabled = func;
  }

  private async graphqlLoginSignup(mutation: any, signature: any): Promise<any> {
    // TODO(dankins): graphql API requires messageHash, r,s,v but they aren't actually used
    const signatureWithHack = { ...signature, messageHash: "n/a", r: "n/a", s: "n/a", v: "n/a" };
    const res = await this.apolloClient.mutate({
      mutation,
      variables: { input: signatureWithHack },
    });
    if (res && res.data && res.data.authWeb3) {
      await this.loginUser(res.data.authWeb3);
    } else {
      console.error("Failed to validate and log in with ETH address. Response:", res);
      throw Error("Failed to validate and log in with ETH address");
    }
  }
}
