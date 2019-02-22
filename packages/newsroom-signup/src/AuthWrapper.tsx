import * as React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { AccountEmailSent, AccountEmailAuth, AccountVerifyToken, AuthApplicationEnum } from "@joincivil/components";
import { isLoggedIn } from "@joincivil/utils";

export interface AuthWrapperState {
  loading: boolean;
  loggedIn: boolean;
  magicEmailSent?: string;
  showTokenVerified?: boolean;
}

export interface AuthParams {
  action?: "login" | "signup";
  token?: string;
}

class AuthWrapperComponent extends React.Component<RouteComponentProps<AuthParams>, AuthWrapperState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      loading: true,
      loggedIn: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    this.setState(
      {
        loggedIn: await isLoggedIn(),
      },
      () => {
        this.setState({
          loading: false,
        });
      },
    );
  }

  public render(): JSX.Element {
    if (this.state.loggedIn) {
      return <>{this.props.children}</>;
    }

    if (this.state.loading) {
      return <>Loading...</>;
    }

    const token = this.props.match.params.token;
    const isNewUser = this.props.match.params.action !== "login";

    if (token || this.state.showTokenVerified) {
      return (
        <AccountVerifyToken
          isNewUser={isNewUser}
          token={token!}
          onAuthenticationContinue={this.onAuthenticationContinue}
        />
      );
    }

    if (this.state.magicEmailSent) {
      return (
        <>
          <AccountEmailSent isNewUser={isNewUser} emailAddress={this.state.magicEmailSent} />
        </>
      );
    }

    // @TODO/tobek Move dapp AuthLogin/AuthSignup into components package and use those here - AccountEmailAuth on its own is missing styles.
    return (
      <>
        <AccountEmailAuth
          applicationType={AuthApplicationEnum.NEWSROOM}
          isNewUser={isNewUser}
          onEmailSend={this.onEmailSend}
        />
        {isNewUser ? (
          <Link to="/apply-to-registry/login">Already have an account?</Link>
        ) : (
          <Link to="/apply-to-registry/signup">Don't have an account?</Link>
        )}
      </>
    );
  }

  private onEmailSend = (isNewUser: boolean, emailAddress: string): void => {
    this.setState({
      magicEmailSent: emailAddress,
    });
  };

  private onAuthenticationContinue = (isNewUser: boolean) => {
    // Remove e.g. /signup/[token] from path
    this.props.history.replace({
      pathname: "/apply-to-registry",
    });

    // @TODO/tobek Once token verification is handled better (flushing apollo cache so that client uses auth header) we can jump straight to "logged in" state. For now we have to refresh, and on refresh we'll be in the logged in state.
    this.setState({ showTokenVerified: true }); // prevent flash before reload
    window.location.reload();
  };
}

// Have to declare AuthWrapper type here, can't find any other way to get around "Exported variable 'AuthWrapper' is using name 'StaticContext' from external module" error. Importing `StaticContext` from `react-router` isn't fixing it.
export const AuthWrapper: React.ComponentClass<Pick<RouteComponentProps<AuthParams>, never>> = withRouter(
  AuthWrapperComponent,
);
