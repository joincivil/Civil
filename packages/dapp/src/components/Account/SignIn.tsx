import * as React from "react";
import { AuthApplicationEnum, LoginComponent } from "@joincivil/components";

const { STOREFRONT } = AuthApplicationEnum;

export default class AccountSignIn extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <LoginComponent applicationType={STOREFRONT} onSuccessfulSignIn={this.handleSignIn} />
      </>
    );
  }

  public handleSignIn(token: string): void {
    console.log("Got a token:", { token });
  }
}
