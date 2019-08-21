import * as React from "react";
import { getApolloSessionKey, getCurrentUserQuery } from "@joincivil/utils";
import { Query } from "react-apollo";
import useStateWithLocalStorage from "../hooks/useStateWithLocalStorage";

export interface LoadUserChildrenProps {
  user: any;
  loading: boolean;
}

export interface LoadUserProps {
  children(props: LoadUserChildrenProps): any;
}

export const LoadUser: React.FunctionComponent<LoadUserProps> = props => {
  const apolloSessionKey = getApolloSessionKey();
  const [auth] = useStateWithLocalStorage(apolloSessionKey);

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
        console.log("user 1: ", data.currentUser);
        return renderFunction({ user: data.currentUser, loading });
      }}
    </Query>
  );
};
