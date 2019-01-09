import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import gql from "graphql-tag";

import { Mutation } from "react-apollo";

const verifyTokenMutation = gql`
  mutation($loginJWT: String!) {
    authSignupEmailConfirm(loginJWT: $loginJWT) {
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
  onAuthentication(arg0: AuthLoginResponse): void;
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

    return (
      <>
        <Mutation mutation={verifyTokenMutation}>
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
