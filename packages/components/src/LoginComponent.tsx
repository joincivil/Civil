import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "./styleConstants";
import gql from "graphql-tag";

import { Mutation } from "react-apollo";

const signup = gql`
  mutation($email: String) {
    authSignupEmailSend(email: $email)
  }
`;

export interface LoginComponentProps {}
export interface LoginComponentState {
  email?: string;
}

export class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState> {
  constructor(props: LoginComponentProps) {
    super(props);
    this.state = {
      email: "",
    };
  }

  public render(): JSX.Element {
    return (
      <Mutation mutation={signup}>
        {(signup, { loading, error, data }) => {
          return (
            <>
              <h3>Let's Get Started</h3>
              <form onSubmit={event => this.submit(event, signup)}>
                <input
                  placeholder="Email address"
                  type="text"
                  name="email"
                  value={this.state.email}
                  onChange={event => this.setState({ email: event.target.value })}
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

  private submit(event: any, mutation: Function) {
    event.preventDefault();
    mutation({ variables: { email: this.state.email } });
  }
}
