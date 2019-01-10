import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import gql from "graphql-tag";

import { Mutation } from "react-apollo";

const verifySigninTokenMutation = gql`
  mutation($loginJWT: String!) {
    authSignupEmailConfirm(loginJWT: $loginJWT) {
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

export interface AuthLoginResponse {
  token: string;
  refreshToken: string;
  uid: string;
}

interface VerifyTokenParams {
  token: string;
}

export interface AccountVerifyTokenProps extends RouteComponentProps {
  isNewUser: boolean;
  onAuthentication(arg0: AuthLoginResponse, arg1: boolean): void;
}

interface VerifyTokenState {
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

  public render(): JSX.Element {
    const { token: loginJWT } = this.props.match.params as VerifyTokenParams;
    const { isNewUser } = this.props;

    const verifyMutation = isNewUser ? verifyLoginTokenMutation : verifySigninTokenMutation;

    return (
      <>
        <Mutation mutation={verifyMutation}>
          {(verifyToken, { loading, error, data }) => (
            <button
              onClick={async () => {
                const res = (await verifyToken({ variables: { loginJWT } })) as AuthLoginResponse;

                console.log({ res });
              }}
            >
              Test Token
            </button>
          )}
        </Mutation>
      </>
    );
  }
}
