import * as React from "react";
import gql from "graphql-tag";
import { getApolloClient } from "@joincivil/utils";
import { EmailConfirmVerify } from "./AuthStyledComponents";

const verifyMutation = gql`
  mutation($token: String!) {
    channelsSetEmailConfirm(jwt: $token) {
      ChannelID
    }
  }
`;

export interface ConfirmEmailTokenProps {
  token: string;
  ethAuthNextExt?: boolean;
  onEmailConfirmContinue?(): void;
}

export interface ConfirmEmailTokenState {
  hasVerified: boolean;
  errorMessage: string | undefined;
}

export class ConfirmEmailToken extends React.Component<ConfirmEmailTokenProps, ConfirmEmailTokenState> {
  public state = {
    hasVerified: false,
    errorMessage: undefined,
  };

  constructor(props: ConfirmEmailTokenProps) {
    super(props);
  }

  public async componentDidMount(): Promise<void> {
    return this.handleTokenVerification();
  }

  public handleTokenVerification = async (): Promise<void> => {
    const token = this.props.token;

    const client = getApolloClient();

    try {
      const { error } = await client.mutate({
        mutation: verifyMutation,
        variables: { token },
      });

      if (error) {
        console.log("Error authenticating:", error);
        const errorMessage = error.graphQLErrors.map((e: any) => e.message).join(" ,");
        this.setState({ errorMessage, hasVerified: true });
      } else {
        this.setState({ errorMessage: undefined, hasVerified: true });
      }
    } catch (err) {
      console.error("Error validating token:", err);
      this.setState({ errorMessage: "There was a problem validating your token.", hasVerified: true });
    }
  };

  public render(): JSX.Element {
    const { hasVerified, errorMessage } = this.state;
    const { onEmailConfirmContinue, ethAuthNextExt } = this.props;
    return (
      <EmailConfirmVerify
        hasVerified={hasVerified}
        errorMessage={errorMessage}
        ethAuthNextExt={ethAuthNextExt}
        onEmailConfirmContinue={onEmailConfirmContinue!}
      />
    );
  }
}
