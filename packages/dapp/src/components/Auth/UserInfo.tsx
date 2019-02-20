import * as React from "react";
import { Query } from "react-apollo";
import { updateQuizPayload, getCurrentUserQuery } from "@joincivil/utils";

export class UserInfo extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <h1>Account Home</h1>
        <Query query={getCurrentUserQuery}>
          {({ loading, error, data }) => {
            if (loading) {
              return "Loading...";
            }
            if (error) {
              return `Error! ${JSON.stringify(error)}`;
            }

            const fields = { b: Math.random() };

            return (
              <>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <button
                  onClick={async () => {
                    // This is used to test if the cache is being cleared correctly.
                    await updateQuizPayload(fields);
                  }}
                >
                  Click
                </button>
              </>
            );
          }}
        </Query>
      </>
    );
  }
}
