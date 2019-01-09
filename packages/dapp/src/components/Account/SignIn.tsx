import * as React from "react";
import { AuthApplicationEnum, LoginComponent } from "@joincivil/components";

const { STOREFRONT } = AuthApplicationEnum;

export class AccountSignIn extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <LoginComponent applicationType={STOREFRONT} onSuccessfulSignIn={this.handleSignIn} />
      </>
    );
  }

  public handleSignIn(): void {
    // console.log("Got a token:", { token });
  }
}
