import * as React from "react";
import { EmailSignup as EmailSignupComponent, EmailSignupSuccess } from "@joincivil/components";
import { addToMailingList } from "@joincivil/utils";
import config from "../../helpers/config";

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
      const listID = config.SENDGRID_REGISTRY_LIST_ID;
      let success = false;
      if (listID !== undefined) {
        await addToMailingList(email, listID);
        success = true;
      }
      this.setState(() => ({ email: "", isSignupSuccess: success, isRequestPending: false }));
    } catch (err) {
      this.setState(() => ({ errorMessage: err.message, isRequestPending: false }));
    }
  };
}

export default EmailSignup;
