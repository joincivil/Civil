import * as React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { setCurrentUser, getCurrentUser } from "@joincivil/utils";

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

            const fields = { a: 1 };

            return (
              <>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <button onClick={async () => this.updateQuizPayload(fields)}>Click</button>
              </>
            );
          }}
        </Query>
      </>
    );
  }

  public async updateQuizPayload(fields: {}): Promise<any> {
    const user = await getCurrentUser();

    if (!user) {
      console.log("no user?", { user });
      return;
    }

    const { quizPayload } = user;

    const newQuizPayload = { ...quizPayload, ...fields };

    await setCurrentUser({ quizPayload: newQuizPayload });
  }
}
