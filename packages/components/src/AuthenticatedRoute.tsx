import * as React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { getCurrentUserQuery, getApolloSession } from "@joincivil/utils";
import { Query } from "react-apollo";

export interface AuthenticatedRouteProps extends RouteProps {
  redirectTo: string;
  onlyAllowUnauthenticated?: boolean;
  authUrl: string;
}

export const AuthenticatedRoute = ({
  render,
  redirectTo,
  authUrl,
  onlyAllowUnauthenticated = false,
  ...otherProps
}: AuthenticatedRouteProps) => {
  const auth = getApolloSession();

  const hasAuthToken = !!auth && !!auth.token;

  // TODO(jorgelo): Refactor this boolean logic.
  if (onlyAllowUnauthenticated) {
    if (hasAuthToken) {
      return <Redirect to={redirectTo} />;
    }
  } else {
    if (!hasAuthToken) {
      return <Redirect to={authUrl} />;
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
      <Query<any> query={getCurrentUserQuery}>
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
