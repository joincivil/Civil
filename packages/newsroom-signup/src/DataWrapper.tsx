import * as React from "react";
import { Mutation, Query, MutationFunc, FetchResult } from "react-apollo";
import { EthAddress, CharterData } from "@joincivil/core";
import { NewsroomGqlProps } from "./Newsroom";
import { userDataQuery, getCharterQuery } from "./queries";
import { saveCharterMutation, SaveAddressMutation, saveStepsMutation } from "./mutations";

export interface DataWrapperProps {
  children(props: NewsroomGqlProps): any;
}

export class DataWrapper extends React.Component<DataWrapperProps> {
  public render(): JSX.Element {
    return (
      <Query query={userDataQuery}>
        {({ loading, error, data: userData }) => {
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
              {({ loading: charterLoading, error: charterError, data: charterData, refetch: refetchCharterQuery }) => {
                if (charterLoading) {
                  return "Loading...";
                }
                let doRefetchHack = false;
                if (charterError) {
                  if (charterError.graphQLErrors[0] && charterError.graphQLErrors[0].message === "No jsonb found") {
                    // ok, they haven't saved a charter yet
                    // Due to an apollo bug (https://github.com/apollographql/react-apollo/issues/2070) when a query errors, future refetches from mutation refetchQueries fail to update the query. There are various solutions suggested, some of which didn't work, but using the refetch function we get here will work if we call it just once (once we do data and the query won't error).
                    doRefetchHack = true;
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
                let newsroomDeployTx: string;
                let newsroomAddress: EthAddress;
                if (charterData && charterData.nrsignupNewsroom) {
                  if (charterData.nrsignupNewsroom.charter) {
                    persistedCharter = charterData.nrsignupNewsroom.charter;
                  }
                  grantRequested = charterData.nrsignupNewsroom.grantRequested;
                  grantApproved = charterData.nrsignupNewsroom.grantApproved;
                  newsroomDeployTx = charterData.nrsignupNewsroom.newsroomDeployTx;
                  newsroomAddress = charterData.nrsignupNewsroom.newsroomAddress;
                }

                return (
                  <Mutation
                    mutation={SaveAddressMutation}
                    refetchQueries={[
                      {
                        query: getCharterQuery,
                      },
                    ]}
                  >
                    {saveAddress => {
                      return (
                        <Mutation
                          mutation={saveCharterMutation}
                          onCompleted={async () => {
                            if (doRefetchHack) {
                              await refetchCharterQuery();
                              doRefetchHack = false;
                            }
                          }}
                        >
                          {(saveCharter: MutationFunc) => {
                            return (
                              <Mutation mutation={saveStepsMutation}>
                                {(saveSteps: MutationFunc) => {
                                  return this.props.children({
                                    grantRequested,
                                    grantApproved,
                                    newsroomDeployTx,
                                    newsroomAddress,
                                    profileWalletAddress: userData.currentUser.ethAddress,
                                    savedStep: userData.currentUser.nrStep || 0,
                                    furthestStep: userData.currentUser.nrFurthestStep || 0,
                                    persistedCharter,
                                    saveAddress,
                                    saveSteps,
                                    persistCharter: this.saveCharterFuncFromMutation(saveCharter),
                                  });
                                }}
                              </Mutation>
                            );
                          }}
                        </Mutation>
                      );
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
