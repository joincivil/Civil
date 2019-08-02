import { useStateWithLocalStorage } from "@joincivil/utils";
import * as React from "react";
import { Query } from "react-apollo";

import { getApolloSessionKey } from "../../utils/apolloClient";
import { getCurrentUserQuery } from "../../utils/queries";

export interface AuthenticatedUserContainerChildrenProps {
  user: any;
  loading: boolean;
}

export interface AuthenticatedUserContainerProps {
  children(props: AuthenticatedUserContainerChildrenProps): any;
}

export const AuthenticatedUserContainer: React.FunctionComponent<AuthenticatedUserContainerProps> = props => {
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

        return renderFunction({ user: data.currentUser, loading });
      }}
    </Query>
  );
};
