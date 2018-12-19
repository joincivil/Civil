import * as React from "react";
import { EmailSignup as EmailSignupComponent } from "@joincivil/components";
import { TCR_SENDGRID_LIST_ID, addToMailingList } from "@joincivil/utils";

export interface EmailSignupState {
  email: string;
}

class EmailSignup extends React.Component<{}, EmailSignupState> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
    };
  }
  public render(): JSX.Element {
    return <EmailSignupComponent onChange={this.onEmailSignupChange} onSubmit={this.onEmailSignupSubmit} />;
  }

  private onEmailSignupChange = (name: string, value: string): void => {
    if (name === "EmailSignupTextInput") {
      this.setState({ email: value });
    }
  };

  private onEmailSignupSubmit = async (): Promise<void> => {
    const { email } = this.state;

    try {
      await addToMailingList(email, TCR_SENDGRID_LIST_ID);
    } catch (err) {
      console.error("Error adding to mailing list:", { err });
    }
  };
}

export default EmailSignup;
