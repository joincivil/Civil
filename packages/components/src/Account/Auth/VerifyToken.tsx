import * as React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { setApolloSession } from "@joincivil/utils";
import { ExecuteOnMount, Button, buttonSizes } from "../..";
import { AuthLoginResponse } from "..";
import { PageSubHeadingCentered, PageHeadingTextCentered } from "../../Heading";

const verifySignUpTokenMutation = gql`
  mutation($loginJWT: String!) {
    authSignupEmailConfirm(signupJWT: $loginJWT) {
      token
      refreshToken
      uid
    }
  }
`;

const verifyLoginTokenMutation = gql`
  mutation($loginJWT: String!) {
    authLoginEmailConfirm(loginJWT: $loginJWT) {
      token
      refreshToken
      uid
    }
  }
`;

export interface AccountVerifyTokenProps {
  isNewUser: boolean;
  token: string;
  onAuthenticationContinue(isNewUser: boolean): void;
}

export interface VerifyTokenState {
  hasValidated: boolean;
  errorMessage: string | null;
}

export class AccountVerifyToken extends React.Component<AccountVerifyTokenProps, VerifyTokenState> {
  public state = {
    hasValidated: false,
    errorMessage: null,
  };

  constructor(props: AccountVerifyTokenProps) {
    super(props);
  }

  public renderError(error: any): JSX.Element {
    // TODO(jorgelo): Style figure out how to style this.
    const errorText = error.graphQLErrors.map((e: any) => e.message).join(" ,");

    return <>{errorText}</>;
  }

  public renderVerified(): JSX.Element {
    const { onAuthenticationContinue, isNewUser } = this.props;
    return (
      <>
        <PageSubHeadingCentered>Email Address Confirmed!</PageSubHeadingCentered>
        <PageHeadingTextCentered>Thanks for confirming your email address</PageHeadingTextCentered>

        <Button size={buttonSizes.MEDIUM_WIDE} onClick={() => onAuthenticationContinue(isNewUser)}>
          Continue
        </Button>
      </>
    );
  }
  public render(): JSX.Element {
    const loginJWT = this.props.token;
    const { isNewUser } = this.props;

    const verifyMutation = isNewUser ? verifySignUpTokenMutation : verifyLoginTokenMutation;
    const resultKey = isNewUser ? "authSignupEmailConfirm" : "authLoginEmailConfirm";

    return (
      <>
        <Mutation mutation={verifyMutation}>
          {(verifyToken, { loading, error, data }) => (
            <>
              <ExecuteOnMount
                onDidMount={async () => {
                  const res: any = await verifyToken({ variables: { loginJWT } });
                  const authResponse: AuthLoginResponse = res.data[resultKey];
                  setApolloSession(authResponse);
                  // TODO(jorgelo): Flush the local apollo cache here.
                  this.setState({ hasValidated: true });
                }}
              />

              {this.state.hasValidated ? this.renderVerified() : <>Verifying email...</>}

              <span>{error && this.renderError(error)}</span>
            </>
          )}
        </Mutation>
      </>
    );
  }
}
