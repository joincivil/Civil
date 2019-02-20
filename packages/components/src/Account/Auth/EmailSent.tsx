import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { CheckEmailSection, AuthPageFooterLink } from "./AuthStyledComponents";
import { AuthTextEmailSent, AuthTextCheckSpam } from "./AuthTextComponents";

export interface AccountEmailSentProps extends Partial<RouteComponentProps> {
  isNewUser: boolean;
  emailAddress: string;
  onSendAgain?(): void;
}

export class AccountEmailSent extends React.Component<AccountEmailSentProps> {
  public render(): JSX.Element {
    const { emailAddress, onSendAgain } = this.props;

    return (
      <>
        <AuthTextEmailSent emailAddress={emailAddress} />

        <CheckEmailSection />

        <AuthTextCheckSpam />

        <AuthPageFooterLink>
          {/* // TODO(jorgelo): The link below should have a hover hand. */}
          <a onClick={onSendAgain}>Hey, I didn’t get an email. Can you send one again?</a>
        </AuthPageFooterLink>
      </>
    );
  }
}
