import * as React from "react";
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

export class UserInfo extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <h1>Account Home</h1>
        <Query query={userQuery}>
          {({ loading, error, data }) => {
            if (loading) {
              return "Loading...";
            }
            if (error) {
              return `Error! ${JSON.stringify(error)}`;
            }

            return <pre>{JSON.stringify(data, null, 2)}</pre>;
        }}
      </Query>
    );
  }
}
