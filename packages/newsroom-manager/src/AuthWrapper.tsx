import * as React from "react";
import { AccountEmailSent, AccountEmailAuth, AccountVerifyToken, AuthApplicationEnum } from "@joincivil/components";
import { isLoggedIn } from "@joincivil/utils";

export interface AuthWrapperProps {
  authEnabled?: boolean;
}

export interface AuthWrapperState {
  loading: boolean;
  loggedIn: boolean;
  magicEmailSent?: string;
  token?: string;
}

export class AuthWrapper extends React.Component<AuthWrapperProps, AuthWrapperState> {
  constructor(props: AuthWrapperProps) {
    super(props);
    this.state = {
      loading: true,
      loggedIn: false,
      token: new URLSearchParams(window.location.search).get("token") || undefined,
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
    if (!this.props.authEnabled || this.state.loggedIn) {
      return <>{this.props.children}</>;
    }

    if (this.state.loading) {
      return <>Loading...</>;
    }

    if (this.state.token) {
      return (
        <AccountVerifyToken
          isNewUser={true}
          token={this.state.token}
          onAuthenticationContinue={this.onAuthenticationContinue}
        />
      );
    }

    if (this.state.magicEmailSent) {
      return <AccountEmailSent isNewUser={true} emailAddress={this.state.magicEmailSent} />;
    }

    return (
      <AccountEmailAuth
        applicationType={AuthApplicationEnum.NEWSROOM}
        isNewUser={true}
        onEmailSend={this.onEmailSend}
      />
    );
  }

  private onEmailSend = (isNewUser: boolean, emailAddress: string): void => {
    this.setState({
      magicEmailSent: emailAddress,
    });
  };

  private onAuthenticationContinue = (isNewUser: boolean) => {
    // @TODO/tobek Once token verification is handled better (flushing apollo cache so that client uses auth header) we can jump straight to "logged in" state. For now we have to refresh, and on refresh we'll be in the logged in state.
    window.location.reload();
  };
}
