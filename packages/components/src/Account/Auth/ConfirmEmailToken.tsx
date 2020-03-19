import * as React from "react";
import gql from "graphql-tag";
import { EmailConfirmVerify } from "./AuthStyledComponents";
import { ApolloConsumer } from "react-apollo";
import ApolloClient from "apollo-client";

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
  apolloClient: ApolloClient<any>;
  onEmailConfirmContinue?(): void;
  onMutationSuccess?(): Promise<void>;
}

export interface ConfirmEmailTokenState {
  hasVerified: boolean;
  errorMessage: string | undefined;
}

class ConfirmEmailTokenWithApolloClient extends React.Component<ConfirmEmailTokenProps, ConfirmEmailTokenState> {
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

    const client = this.props.apolloClient;

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
        if (this.props.onMutationSuccess) {
          await this.props.onMutationSuccess();
        }
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

export class ConfirmEmailToken extends React.Component<ConfirmEmailTokenProps> {
  public render(): JSX.Element {
    return (
      <ApolloConsumer>
        {client => <ConfirmEmailTokenWithApolloClient apolloClient={client} {...this.props} />}
      </ApolloConsumer>
    );
  }
}
