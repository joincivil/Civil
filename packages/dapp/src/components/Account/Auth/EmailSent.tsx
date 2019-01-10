import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

interface AccountEmailSentProps extends RouteComponentProps {
  isNewUser: boolean;
}

export class AccountEmailSent extends React.Component<AccountEmailSentProps> {
  public render(): JSX.Element {
    const { emailAddress } = this.props.location.state;

    const { isNewUser } = this.props;
    return (
      <>
        Check your email to {!isNewUser ? "sign in" : "register"}: <strong>{emailAddress}</strong>
      </>
    );
  }
}
