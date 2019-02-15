import * as React from "react";
import gql from "graphql-tag";
import { Mutation, Query, MutationFunc, FetchResult } from "react-apollo";
import { EthAddress, CharterData } from "@joincivil/core";

const JSON_BLOB_ID = "newsroomSignupCharter";

const userEthAddress = gql`
  query {
    currentUser {
      ethAddress
    }
  }
`;
// Unfortunately we can't combine this charter query with eth address query, because if no charter is saved at all yet, then the whole query errors and we won't get eth address
const getCharterQuery = gql`
  query {
    jsonb(id: "${JSON_BLOB_ID}") {
      rawJson
    }
  }
`;

const saveCharterMutation = gql`
  mutation($input: JsonbInput!) {
    jsonbSave(input: $input) {
      id
    }
  }
`;

export interface DataWrapperChildrenProps {
  profileWalletAddress: EthAddress;
  persistedCharter: Partial<CharterData>;
  persistCharter(charter: Partial<CharterData>): Promise<void | FetchResult>;
}

export interface DataWrapperProps {
  children(props: DataWrapperChildrenProps): any;
}

export class DataWrapper extends React.Component<DataWrapperProps> {
  public render(): JSX.Element {
    return (
      <Query query={userEthAddress}>
        {({ loading, error, data }) => {
          if (loading) {
            return "Loading...";
          }
          if (error) {
            return `Error! ${JSON.stringify(error)}`;
          }

          return (
            <Query query={getCharterQuery}>
              {({ loading: charterLoading, error: charterError, data: charterData }) => {
                if (charterLoading) {
                  return "Loading...";
                }
                if (charterError) {
                  if (charterError.graphQLErrors && charterError.graphQLErrors[0].message === "No jsonb found") {
                    // ok, they haven't saved a charter yet
                  } else {
                    return `Error! ${JSON.stringify(charterError)}`;
                  }
                }

                let persistedCharter: Partial<CharterData>;
                if (charterData && charterData.jsonb && charterData.jsonb.rawJson) {
                  try {
                    persistedCharter = JSON.parse(charterData.jsonb.rawJson);
                  } catch (err) {
                    console.error("Failed to parse persisted charter JSON", err, charterData.jsonb.rawJson);
                  }
                }

                return (
                  <Mutation mutation={saveCharterMutation}>
                    {(saveCharter: MutationFunc) => {
                      return this.props.children({
                        profileWalletAddress: data.currentUser.ethAddress,
                        persistedCharter,
                        persistCharter: this.saveCharterFuncFromMutation(saveCharter),
                      });
                    }}
                  </Mutation>
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  }

  private saveCharterFuncFromMutation(mutation: MutationFunc): (charter: Partial<CharterData>) => Promise<void | FetchResult> {
    return async (charter: Partial<CharterData>) => {
      return await mutation({
        variables: {
          input: {
            id: JSON_BLOB_ID,
            jsonStr: JSON.stringify(charter),
          },
        },
      });
    };
  }
}
