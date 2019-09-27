import ApolloClient from "apollo-client";
import { clearApolloSession, setApolloSession, getCurrentUserQuery, getApolloSession } from "@joincivil/utils";

export interface AuthServiceOptions {
  apolloClient: ApolloClient<any>;
  onAuthChange(currentUser: any): void;
}

export class AuthService {
  public currentUser?: any;
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

  public logout(): void {
    clearApolloSession();
    delete this.currentUser;
    if (this.onAuthChange) {
      this.onAuthChange();
    }
  }
  public async loginUser(session: any): Promise<void> {
    setApolloSession(session);

    this.currentUser = await this.fetchCurrentUser();
    if (this.onAuthChange) {
      this.onAuthChange(this.currentUser);
    }
  }

  public async fetchCurrentUser(): Promise<void> {
    const result = await this.apolloClient.query({ query: getCurrentUserQuery, fetchPolicy: "no-cache" });

    if (result.errors) {
      throw new Error("error fetching user");
    }
    return result.data.currentUser;
  }
}
