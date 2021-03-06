import * as React from "react";
import { getApolloSessionKey, getCurrentUserQuery } from "@joincivil/utils";
import { Query } from "react-apollo";
import useStateWithLocalStorage from "../hooks/useStateWithLocalStorage";

export interface LoadUserChildrenProps {
  user: any;
  loading: boolean;
  refetch?: any;
}

export interface LoadUserProps {
  children(props: LoadUserChildrenProps): any;
}

export const LoadUser: React.FunctionComponent<LoadUserProps> = props => {
  const apolloSessionKey = getApolloSessionKey();
  const [auth] = useStateWithLocalStorage(apolloSessionKey);
  useStateWithLocalStorage("network"); // basically just pay attention to when network is set

  const renderFunction = props.children;
  const hasAuthToken = auth && auth.token;

  if (!hasAuthToken) {
    return <>{renderFunction({ user: null, loading: false })}</>;
  }

  return (
    <Query<any> query={getCurrentUserQuery}>
      {({ loading, error, data, refetch }) => {
        if (loading || error) {
          return renderFunction({ user: null, loading, refetch });
        }

        return renderFunction({ user: data.currentUser, loading, refetch });
      }}
    </Query>
  );
};
