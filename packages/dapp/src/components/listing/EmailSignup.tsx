import * as React from "react";
import { EmailSignup as EmailSignupComponent, EmailSignupSuccess } from "@joincivil/components";
import { TCR_SENDGRID_LIST_ID, addToMailingList } from "@joincivil/utils";

export interface EmailSignupState {
  email: string;
  errorMessage: string;
  isSignupSuccess: boolean;
  isRequestPending: boolean;
}

class EmailSignup extends React.Component<{}, EmailSignupState> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      errorMessage: "",
      isSignupSuccess: false,
      isRequestPending: false,
    };
  }
  public render(): JSX.Element {
    const { email, errorMessage, isSignupSuccess, isRequestPending } = this.state;

    if (isSignupSuccess) {
      return <EmailSignupSuccess />;
    }

    return (
      <EmailSignupComponent
        onChange={this.onEmailSignupChange}
        onSubmit={this.onEmailSignupSubmit}
        email={email}
        errorMessage={errorMessage}
        isRequestPending={isRequestPending}
      />
    );
  }

  private onEmailSignupChange = (name: string, value: string): void => {
    if (name === "EmailSignupTextInput") {
      this.setState({ email: value });
    }
  };

  private onEmailSignupSubmit = async (): Promise<void> => {
    const { email } = this.state;

    try {
      this.setState(() => ({ isRequestPending: true }));
      await addToMailingList(email, TCR_SENDGRID_LIST_ID);
      this.setState(() => ({ email: "", isSignupSuccess: true, isRequestPending: false }));
    } catch (err) {
      this.setState(() => ({ errorMessage: err.message, isRequestPending: false }));
    }
  };
}

export default EmailSignup;
