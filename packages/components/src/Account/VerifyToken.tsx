import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { setApolloSession } from "@joincivil/utils";
import { ExecuteOnMount, Button, buttonSizes } from "../";
import { AuthLoginResponse } from "./";

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

interface VerifyTokenParams {
  token: string;
}

export interface AccountVerifyTokenProps extends Partial<RouteComponentProps> {
  isNewUser: boolean;
  onAuthenticationContinue(isNewUser: boolean): void;
  token?: string;
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
    const errorText = error.graphQLErrors.map((e: any) => e.message).join(" ,");

    return <>{errorText}</>;
  }

  public render(): JSX.Element {
    const loginJWT = this.props.token || (this.props.match!.params as VerifyTokenParams).token;
    const { isNewUser, onAuthenticationContinue } = this.props;

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

              {this.state.hasValidated ? (
                <>
                  <h3>Email Address Confirmed!</h3>
                  <p>Thanks for confirming your email address</p>
                  <Button size={buttonSizes.MEDIUM_WIDE} onClick={() => onAuthenticationContinue(isNewUser)}>
                    Continue
                  </Button>
                </>
              ) : (
                <>Verifying email...</>
              )}

              <span>{error && this.renderError(error)}</span>
            </>
          )}
        </Mutation>
      </>
    );
  }
}
