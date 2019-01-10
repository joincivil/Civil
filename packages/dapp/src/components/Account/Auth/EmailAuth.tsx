import * as React from "react";
import gql from "graphql-tag";
import { RouteComponentProps } from "react-router-dom";
import { AuthApplicationEnum, AuthLoginResponse } from "../index";
import { Mutation, MutationFn } from "react-apollo";

const signupMutation = gql`
  mutation($emailAddress: String!) {
    authSignupEmailSend(emailAddress: $emailAddress)
  }
`;

const loginMutation = gql`
  mutation($emailAddress: String!) {
    authLoginEmailSend(emailAddress: $emailAddress)
  }
`;

export interface AuthSignupEmailSendResult {
  data: {
    authSignupEmailSend: string;
  };
}

export interface AccountEmailAuthProps extends RouteComponentProps {
  applicationType: AuthApplicationEnum;
  isNewUser: boolean;
  onEmailSend(isNewUser: boolean): void;
}

export interface AccountEmailAuthState {
  emailAddress: string;
}

export class AccountEmailAuth extends React.Component<AccountEmailAuthProps, AccountEmailAuthState> {
  constructor(props: AccountEmailAuthProps) {
    super(props);
    this.state = {
      emailAddress: "",
    };
  }

  public render(): JSX.Element {
    const { isNewUser } = this.props;

    const emailMutation = isNewUser ? signupMutation : loginMutation;
    return (
      <Mutation mutation={emailMutation}>
        {(sendEmail, { loading, error, data }) => {
          return (
            <>
              <h3>Let's Get Started</h3>
              <form onSubmit={async event => this.submit(event, sendEmail)}>
                <input
                  placeholder="Email address"
                  type="text"
                  name="email"
                  value={this.state.emailAddress}
                  onChange={event => this.setState({ emailAddress: event.target.value })}
                />
                <input type="submit" value="Confirm" />
              </form>

              {loading && <span>loading...</span>}
            </>
          );
        }}
      </Mutation>
    );
  }

  private async submit(event: any, mutation: MutationFn): Promise<void> {
    event.preventDefault();

    const { emailAddress } = this.state;
    const { applicationType, onEmailSend, isNewUser } = this.props;

    const resultKey = isNewUser ? "authSignupEmailConfirm" : "authLoginEmailConfirm";

    const res: any = await mutation({
      variables: { emailAddress, application: applicationType },
    });

    const authResponse: string = res.data[resultKey];

    if (authResponse === "ok") {
      onEmailSend(isNewUser);
      return;
    }

    alert("Error:" + authResponse);
    return;
  }
}
