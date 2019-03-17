import * as React from "react";
import gql from "graphql-tag";
import { Mutation, Query, MutationFunc, FetchResult } from "react-apollo";
import { EthAddress, CharterData } from "@joincivil/core";

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
    nrsignupNewsroom {
      grantRequested
      grantApproved
      charter {
        name
        tagline
        logoUrl
        newsroomUrl
        roster {
          name
          role
          bio
          ethAddress
          socialUrls {
            twitter
            facebook
          }
          avatarUrl
          signature
        }
        signatures {
          signer
          signature
          message
        }
        mission {
          purpose
          structure
          revenue
          encumbrances
          miscellaneous
        }
        socialUrls {
          twitter
          facebook
        }
      }
    }
  }
`;

const saveCharterMutation = gql`
  mutation($input: CharterInput!) {
    nrsignupSaveCharter(charterData: $input)
  }
`;

export interface DataWrapperChildrenProps {
  grantRequested?: boolean;
  grantApproved?: boolean;
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
            return (
              <>
                Sorry, there was an error! <code>{JSON.stringify(error)}</code>
              </>
            );
          }

          return (
            <Query query={getCharterQuery}>
              {({ loading: charterLoading, error: charterError, data: charterData }) => {
                if (charterLoading) {
                  return "Loading...";
                }
                if (charterError) {
                  if (charterError.graphQLErrors[0] && charterError.graphQLErrors[0].message === "No jsonb found") {
                    // ok, they haven't saved a charter yet
                  } else {
                    return (
                      <>
                        Sorry, there was an error! <code>{JSON.stringify(charterError)}</code>
                      </>
                    );
                  }
                }

                let persistedCharter: Partial<CharterData>;
                let grantRequested: boolean;
                let grantApproved: boolean;
                if (charterData && charterData.nrsignupNewsroom) {
                  if (charterData.nrsignupNewsroom.charter) {
                    persistedCharter = charterData.nrsignupNewsroom.charter;
                  }
                  grantRequested = charterData.nrsignupNewsroom.grantRequested;
                  grantApproved = charterData.nrsignupNewsroom.grantApproved;
                }

                return (
                  <Mutation mutation={saveCharterMutation}>
                    {(saveCharter: MutationFunc) => {
                      return this.props.children({
                        grantRequested,
                        grantApproved,
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

  private saveCharterFuncFromMutation(
    mutation: MutationFunc,
  ): (charter: Partial<CharterData>) => Promise<void | FetchResult> {
    return async (charter: any) => {
      return mutation({
        variables: {
          input: charter,
        },
      });
    };
  }
}
