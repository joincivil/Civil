import * as React from "react";
import { EmailSignup as EmailSignupComponent } from "@joincivil/components";

class EmailSignup extends React.Component {

  public render(): JSX.Element {
    return (
      <EmailSignupComponent onChange={this.onEmailSignupChange} onSubmit={this.onEmailSignupSubmit} />
    );
  }

  private onEmailSignupChange = (name: string, value: string): void => {
    console.log("email signup input changed", name, value);
  }

  private onEmailSignupSubmit = (): void => {
    console.log("email signup submitted");
  }
}

export default EmailSignup;
