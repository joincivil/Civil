import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { CheckEmailSection, AuthPageFooterLink } from "./AuthStyledComponents";
import { PageSubHeadingCentered, PageHeadingTextCentered } from "../../Heading";
import { AuthTextEmailSent } from "./AuthTextComponents";

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
        <PageSubHeadingCentered>Check your email!</PageSubHeadingCentered>

        <AuthTextEmailSent emailAddress={emailAddress} />

        <CheckEmailSection />

        <PageHeadingTextCentered>Please check your spam folder if you don’t see the email.</PageHeadingTextCentered>

        <AuthPageFooterLink>
          {/* // TODO(jorgelo): The link below should have a hover hand. */}
          <a onClick={onSendAgain}>Hey, I didn’t get an email. Can you send one again?</a>
        </AuthPageFooterLink>
      </>
    );
  }
}
