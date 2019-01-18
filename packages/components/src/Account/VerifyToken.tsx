import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import gql from "graphql-tag";
import { ExecuteOnMount } from "../";
import { Mutation } from "react-apollo";
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

export interface AccountVerifyTokenProps extends RouteComponentProps {
  isNewUser: boolean;
  onAuthentication(loginResponse: AuthLoginResponse, isNewUser: boolean): void;
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
    const { token: loginJWT } = this.props.match.params as VerifyTokenParams;
    const { isNewUser, onAuthentication } = this.props;

    const verifyMutation = isNewUser ? verifySignUpTokenMutation : verifyLoginTokenMutation;
    const resultKey = isNewUser ? "authSignupEmailConfirm" : "authLoginEmailConfirm";

    return (
      <>
        <Mutation mutation={verifyMutation}>
          {(verifyToken, { loading, error, data }) => (
            <>
              <span>{error && this.renderError(error)}</span>
              <ExecuteOnMount
                onDidMount={async () => {
                  const res: any = await verifyToken({ variables: { loginJWT } });
                  const authResponse: AuthLoginResponse = res.data[resultKey];

                  onAuthentication(authResponse, isNewUser);
                  console.log({ authResponse });
                }}
              />
            </>
          )}
        </Mutation>
      </>
    );
  }
}
