import * as React from "react";
import gql from "graphql-tag";
import { setApolloSession, getApolloClient } from "@joincivil/utils";
import { Button, buttonSizes } from "../..";
import { AuthLoginResponse } from "..";
import { AuthTextVerifyTokenConfirmed } from "./AuthTextComponents";

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

  public async componentDidMount(): Promise<void> {
    return this.handleTokenVerification();
  }

  public renderVerified(): JSX.Element {
    const { onAuthenticationContinue, isNewUser } = this.props;
    return (
      <>
        <AuthTextVerifyTokenConfirmed />

        <Button size={buttonSizes.MEDIUM_WIDE} onClick={() => onAuthenticationContinue(isNewUser)}>
          Continue
        </Button>
      </>
    );
  }

  public handleTokenVerification = async (): Promise<void> => {
    const { isNewUser } = this.props;
    const token = this.props.token;

    const client = getApolloClient({});

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
        this.setState({ errorMessage, hasValidated: true });
      } else {
        const authResponse: AuthLoginResponse = data[resultKey];
        setApolloSession(authResponse);

        this.setState({ errorMessage: null, hasValidated: true });
      }
    } catch (err) {
      console.error("Error validating token:", err);
      this.setState({ errorMessage: "There was a problem validating your token.", hasValidated: true });
    }
  };

  public renderError(errorMessage: string): JSX.Element {
    // TODO(jorgelo): What should the error state look like?
    return <h1>Error: {errorMessage}</h1>;
  }

  public renderVerifiying(): JSX.Element {
    // TODO(jorgelo): What should this loading look like?
    return <h1>Verifiying...</h1>;
  }

  public render(): JSX.Element {
    const { hasValidated, errorMessage } = this.state;

    if (!hasValidated) {
      return this.renderVerifiying();
    }

    if (errorMessage) {
      return this.renderError(errorMessage);
    }

    return this.renderVerified();
  }
}
