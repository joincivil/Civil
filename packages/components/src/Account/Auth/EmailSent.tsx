import * as React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { CheckEmailSection } from "./AuthStyledComponents";
import { ManagerHeadingCentered, CenteredText } from "../../Heading";

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
        <ManagerHeadingCentered>Check your email!</ManagerHeadingCentered>
        <CenteredText>
          We sent you an email to <strong>{emailAddress}</strong> that includes a link to confirm your email address. It
          expires soon, so please check your email and click on the link. Once confimed, you can continue.
        </CenteredText>

        <CheckEmailSection />

        <CenteredText>Please check your spam folder if you don’t see the email.</CenteredText>

        <CenteredText>
          <a onClick={onSendAgain}>Hey, I didn’t get an email. Can you send one again?</a>
        </CenteredText>
      </>
    );
  }
}
