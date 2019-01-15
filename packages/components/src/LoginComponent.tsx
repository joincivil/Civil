import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "./styleConstants";
import gql from "graphql-tag";

import { Mutation, MutationFn } from "react-apollo";

const signupMutation = gql`
  mutation($emailAddress: String!) {
    authSignupEmailSend(emailAddress: $emailAddress)
  }
`;

export enum AuthApplicationEnum {
  DEFAULT = "DEFAULT",
  NEWSROOM = "NEWSROOM",
  STOREFRONT = "STOREFRONT",
}

export interface LoginComponentProps {
  applicationType: AuthApplicationEnum;
}

export interface LoginComponentState {
  emailAddress: string;
}

export class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState> {
  constructor(props: LoginComponentProps) {
    super(props);
    this.state = {
      emailAddress: "",
    };
  }

  public render(): JSX.Element {
    return (
      <Mutation mutation={signupMutation}>
        {(signup, { loading, error, data }) => {
          return (
            <>
              <h3>Let's Get Started</h3>
              <form onSubmit={event => this.submit(event, signup)}>
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

              <pre>{JSON.stringify(data)}</pre>
            </>
          );
        }}
      </Mutation>
    );
  }

  private async submit(event: any, mutation: MutationFn): Promise<void> {
    event.preventDefault();

    const { emailAddress } = this.state;
    const { applicationType } = this.props;

    mutation({ variables: { emailAddress, application: applicationType } });
  }
}
