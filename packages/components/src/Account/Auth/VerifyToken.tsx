import * as React from "react";
import gql from "graphql-tag";
import { useApolloClient } from "@apollo/react-hooks";
import { AuthLoginResponse } from "..";
import { AuthEmailVerify } from "./AuthStyledComponents";

const verifySignUpTokenMutation = gql`
  mutation($token: String!) {
    authSignupEmailConfirm(signupJWT: $token) {
      token
      refreshToken
      uid
    }
  }
`;

const verifyLoginTokenMutation = gql`
  mutation($token: String!) {
    authLoginEmailConfirm(loginJWT: $token) {
      token
      refreshToken
      uid
    }
  }
`;

export interface AccountVerifyTokenProps {
  isNewUser: boolean;
  token: string;
  ethAuthNextExt?: boolean;
  onTokenVerification(authInfo: any): void;
  onAuthenticationContinue(isNewUser: boolean): void;
}

export interface VerifyTokenState {
  hasVerified: boolean;
  errorMessage: string | undefined;
}

export class AccountVerifyToken extends React.Component<AccountVerifyTokenProps, VerifyTokenState> {
  public state = {
    hasVerified: false,
    errorMessage: undefined,
  };

  constructor(props: AccountVerifyTokenProps) {
    super(props);
  }

  public async componentDidMount(): Promise<void> {
    return this.handleTokenVerification();
  }

  public handleTokenVerification = async (): Promise<void> => {
    const { isNewUser, onTokenVerification } = this.props;
    const token = this.props.token;

    const client = useApolloClient();

    const verifyMutation = isNewUser ? verifySignUpTokenMutation : verifyLoginTokenMutation;
    const resultKey = isNewUser ? "authSignupEmailConfirm" : "authLoginEmailConfirm";

    try {
      const { data, error } = await client.mutate({
        mutation: verifyMutation,
        variables: { token },
      });

      if (error) {
        console.log("Error authenticating:", error);
        const errorMessage = error.graphQLErrors.map((e: any) => e.message).join(" ,");
        this.setState({ errorMessage, hasVerified: true });
      } else {
        const authResponse: AuthLoginResponse = data[resultKey];
        onTokenVerification(authResponse);

        this.setState({ errorMessage: undefined, hasVerified: true });
      }
    } catch (err) {
      console.error("Error validating token:", err);
      this.setState({ errorMessage: "There was a problem validating your token.", hasVerified: true });
    }
  };

  public render(): JSX.Element {
    const { hasVerified, errorMessage } = this.state;
    const { onAuthenticationContinue, isNewUser, ethAuthNextExt } = this.props;

    return (
      <AuthEmailVerify
        hasVerified={hasVerified}
        errorMessage={errorMessage}
        ethAuthNextExt={ethAuthNextExt}
        onAuthenticationContinue={() => onAuthenticationContinue(isNewUser)}
      />
    );
  }
}
