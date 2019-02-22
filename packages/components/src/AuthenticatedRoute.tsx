import * as React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { getApolloSession } from "@joincivil/utils";
import gql from "graphql-tag";
import { Query } from "react-apollo";

export interface AuthenticatedRouteProps extends RouteProps {
  redirectTo: string;
  onlyAllowUnauthenticated?: boolean;
  signupUrl: string;
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
  render,
  redirectTo,
  signupUrl,
  onlyAllowUnauthenticated = false,
  ...otherProps
}: AuthenticatedRouteProps) => {
  const auth = getApolloSession();

  const hasAuthToken = !!auth && !!auth.token;

  if (onlyAllowUnauthenticated) {
    if (hasAuthToken) {
      return <Redirect to={redirectTo} />;
    }
  } else {
    if (!hasAuthToken) {
      return <Redirect to={signupUrl} />;
    }
  }

  if (!render) {
    throw new Error("Please set a render function");
  }

  // TODO(jorgelo): Get the line below working without the ts-ignore
  // @ts-ignore
  const renderChildren = () => render(otherProps);

  if (onlyAllowUnauthenticated && !hasAuthToken) {
    if (render) {
      return renderChildren();
    }

    return null;
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

          if (render) {
            return renderChildren();
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
