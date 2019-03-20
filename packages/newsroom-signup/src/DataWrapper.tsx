import * as React from "react";
import { Mutation, Query, MutationFunc, FetchResult } from "react-apollo";
import { EthAddress, CharterData } from "@joincivil/core";
import { userEthAddress, getCharterQuery } from "./queries";
import { saveCharterMutation, SaveAdressMutation } from "./mutations";

export interface DataWrapperChildrenProps {
  newsroomDeployTx?: EthAddress;
  newsroomAddress?: string;
  grantRequested?: boolean;
  grantApproved?: boolean;
  profileWalletAddress: EthAddress;
  persistedCharter: Partial<CharterData>;
  saveAddress: MutationFunc;
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
                    mutation={SaveAdressMutation}
                    refetchQueries={[
                      {
                        query: getCharterQuery,
                      },
                    ]}
                  >
                    {saveAddress => {
                      return (
                        <Mutation mutation={saveCharterMutation}>
                          {(saveCharter: MutationFunc) => {
                            return this.props.children({
                              grantRequested,
                              grantApproved,
                              newsroomDeployTx,
                              newsroomAddress,
                              profileWalletAddress: data.currentUser.ethAddress,
                              persistedCharter,
                              saveAddress,
                              persistCharter: this.saveCharterFuncFromMutation(saveCharter),
                            });
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
