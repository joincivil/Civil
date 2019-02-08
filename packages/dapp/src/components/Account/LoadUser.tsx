import * as React from "react";
import { getApolloSession } from "@joincivil/utils";
import gql from "graphql-tag";
import { Query } from "react-apollo";

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

export interface LoadUserChildrenProps {
  user: any;
  loading: boolean;
}

export interface LoadUserProps {
  children(props: LoadUserChildrenProps): any;
}

export const LoadUser: React.SFC<LoadUserProps> = props => {
  const auth = getApolloSession();

  const renderFunction = props.children;
  const hasAuthToken = auth && auth.token;

  if (!hasAuthToken) {
    return <>{renderFunction({ user: null, loading: false })}</>;
  }

  return (
    <Query query={userQuery}>
      {({ loading, error, data }) => {
        if (loading || error) {
          return renderFunction({ user: null, loading });
        }

        return renderFunction({ user: data.currentUser, loading });
      }}
    </Query>
  );
};
