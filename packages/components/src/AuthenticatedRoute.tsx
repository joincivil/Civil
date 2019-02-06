import * as React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { getApolloSession } from "@joincivil/utils";
import gql from "graphql-tag";
import { Query } from "react-apollo";

export interface AuthenticatedRouteProps extends RouteProps {
  redirectTo: string;
  onlyAllowUnauthenticated?: boolean;
  onlyAllowWithoutEth?: boolean;
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

// TODO(jorgelo): Use a configuration or something for this.
const ethSignupPath = "/account/eth";

export const AuthenticatedRoute = ({
  component: Component,
  redirectTo,
  onlyAllowUnauthenticated = false,
  onlyAllowWithoutEth = false,
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

          const hasEth = data.currentUser && data.currentUser.ethAddress;

          if (!hasEth && !onlyAllowWithoutEth) {
            return <Redirect to={redirectTo} />;
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
