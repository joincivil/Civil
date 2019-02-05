import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

export interface AccountEmailSentProps extends Partial<RouteComponentProps> {
  isNewUser: boolean;
  emailAddress?: string;
}

export class AccountEmailSent extends React.Component<AccountEmailSentProps> {
  public render(): JSX.Element {
    const emailAddress = this.props.emailAddress || this.props.location!.state.emailAddress;

    const { isNewUser } = this.props;
    return (
      <>
        Check your email to {!isNewUser ? "sign in" : "register"}: <strong>{emailAddress}</strong>
      </>
    );
  }
}
