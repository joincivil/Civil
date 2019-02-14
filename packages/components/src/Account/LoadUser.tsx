import * as React from "react";
import { getApolloSession, getCurrentUserQuery } from "@joincivil/utils";
import { Query } from "react-apollo";

export interface LoadUserChildrenProps {
  user: any;
  loading: boolean;
}

export interface LoadUserProps {
  children(props: any): any;
}

export const LoadUser: React.SFC<LoadUserProps> = props => {
  const auth = getApolloSession();

  const renderFunction = props.children;
  const hasAuthToken = auth && auth.token;

  if (!hasAuthToken) {
    return <>{renderFunction({ user: null, loading: false })}</>;
  }

  return (
    <Query query={getCurrentUserQuery}>
      {({ loading, error, data }) => {
        if (loading || error) {
          return renderFunction({ user: null, loading });
        }

        return renderFunction({ user: data.currentUser, loading });
      }}
    </Query>
  );
};
