import * as React from "react";
import { BrowserRouter as Router, Route, RouteProps, Redirect } from "react-router-dom";
import { getApolloSession } from "@joincivil/utils";
import gql from "graphql-tag";
import { Query } from "react-apollo";

export interface AuthenticatedRouteProps extends RouteProps {
  component: React.ComponentType;
  redirectTo: string;
  onlyAllowUnauthenicated?: boolean;
  children?: any[];
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
  ...other
}: AuthenticatedRouteProps) => {
  const auth = getApolloSession();

  console.log("AuthenticatedRoute:", { auth });

  const hasAuthToken = !!(auth && auth.token);

  if (onlyAllowUnauthenicated === hasAuthToken) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <Query query={userQuery}>
      {({ loading, error, data }) => {
        if (loading) {
          return "Loading....";
        }

        console.log({ error });
        if (error) {
          return <Redirect to={redirectTo} />;
        }

        return <Component {...other} />;
      }}
    </Query>
  );
};

export const UnauthenticatedRoute = (props: AuthenticatedRouteProps) => (
  <AuthenticatedRoute onlyAllowUnauthenicated={true} {...props} />
);
