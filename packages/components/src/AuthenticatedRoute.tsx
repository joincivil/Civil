import * as React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { getApolloSession } from "@joincivil/utils";
import gql from "graphql-tag";
import { Query } from "react-apollo";

export interface AuthenticatedRouteProps extends RouteProps {
  redirectTo: string;
  onlyAllowUnauthenicated?: boolean;
}

const userQuery = gql`
  query {
    currentUser {
      uid
      email
      ethAddress
      onfidoApplicantId
      onfidoCheckID
      kycStatus
      quizPayload
      quizStatus
    }
  }
`;

export const AuthenticatedRoute = ({
  component: Component,
  redirectTo,
  onlyAllowUnauthenicated = false,
  ...otherProps
}: AuthenticatedRouteProps) => {
  const auth = getApolloSession();

  const hasAuthToken = !!(auth && auth.token);

  if (onlyAllowUnauthenicated === hasAuthToken) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <Route {...otherProps}>
      <Query query={userQuery}>
        {({ loading, error, data }) => {
          if (loading) {
            return null;
          }

          if (error) {
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
  <AuthenticatedRoute onlyAllowUnauthenicated={true} {...props} />
);
