import * as React from "react";

interface AccountEmailSentProps {
  isNewUser: boolean;
}
export class AccountEmailSent extends React.Component<AccountEmailSentProps> {
  public render(): JSX.Element {
    const { isNewUser } = this.props;
    return <>Check your email to {!isNewUser ? "sign in" : "register"}</>;
  }
}
