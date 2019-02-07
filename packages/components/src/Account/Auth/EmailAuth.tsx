import * as React from "react";
import gql from "graphql-tag";
import { AuthApplicationEnum } from "../index";
import { Mutation, MutationFn } from "react-apollo";
import { Link } from "react-router-dom";

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

export interface AccountEmailAuthProps {
  applicationType: AuthApplicationEnum;
  isNewUser: boolean;
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

export interface AccountEmailAuthState {
  emailAddress: string;
  errorMessage: string | null;
}

export class AccountEmailAuth extends React.Component<AccountEmailAuthProps, AccountEmailAuthState> {
  constructor(props: AccountEmailAuthProps) {
    super(props);
    this.state = {
      emailAddress: "",
      errorMessage: null,
    };
  }

  public renderLink(): JSX.Element {
    const { isNewUser } = this.props;

    if (isNewUser) {
      return <Link to="./login">Or login</Link>;
    }

    return <Link to="./signup">Or sign up</Link>;
  }

  public render(): JSX.Element {
    const { isNewUser } = this.props;
    const { errorMessage } = this.state;

    const emailMutation = isNewUser ? signupMutation : loginMutation;
    return (
      <Mutation mutation={emailMutation}>
        {(sendEmail, { loading, error, data }) => {
          return (
            <>
              <h3>Let's Get Started</h3>
              {errorMessage && <span>Error: {errorMessage}</span>}
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

              {this.renderLink()}
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

    const resultKey = isNewUser ? "authSignupEmailSend" : "authLoginEmailSend";

    const res: any = await mutation({
      variables: { emailAddress, application: applicationType },
    });

    const authResponse: string = res.data[resultKey];

    if (authResponse === "ok") {
      onEmailSend(isNewUser, emailAddress);
      return;
    }

    this.setState({ errorMessage: authResponse });

    return;
  }
}
