import * as React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { getApolloSession } from "@joincivil/utils";
import gql from "graphql-tag";
import { Query } from "react-apollo";

export interface AuthenticatedRouteProps extends RouteProps {
  redirectTo: string;
  onlyAllowUnauthenticated?: boolean;
  allowWithoutEth?: boolean;
  ethSignupPath: string;
}

const userQuery = gql`
  query {
    currentUser {
      uid
      email
      ethAddress
      quizPayload
      quizStatus
    }
  }
`;

export const AuthenticatedRoute = ({
  component: Component,
  redirectTo,
  onlyAllowUnauthenticated = false,
  allowWithoutEth = false,
  ethSignupPath,
  ...otherProps
}: AuthenticatedRouteProps) => {
  const auth = getApolloSession();

  const hasAuthToken = !!auth && !!auth.token;

  if (onlyAllowUnauthenticated === hasAuthToken) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <Route {...otherProps}>
      <Query query={userQuery}>
        {({ loading, error, data }) => {
          if (loading) {
            return null;
          }

          if (error && !onlyAllowUnauthenticated) {
            return <Redirect to={redirectTo} />;
          }

          const hasEth = error || (data.currentUser && data.currentUser.ethAddress);

          if (!hasEth && !allowWithoutEth) {
            // User doesn't have a wallet, but is signed in, redirect them to add their wallet.
            return <Redirect to={ethSignupPath} />;
          }

          if (Component) {
            // TODO(jorgelo): Get the line below working without the ts-ignore
            // @ts-ignore
            return <Component {...otherProps} />;
          }

          return null;
        }}
      </Query>
    </Route>
  );
};

export const UnauthenticatedRoute = (props: AuthenticatedRouteProps) => (
  <AuthenticatedRoute onlyAllowUnauthenticated={true} {...props} />
);
