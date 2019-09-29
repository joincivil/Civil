import * as React from "react";
import { Mutation, Query, MutationFunc, FetchResult } from "react-apollo";
import { EthAddress, CharterData } from "@joincivil/core";
import { NewsroomGqlProps } from "./Newsroom";
import { userDataQuery, getCharterQuery } from "./queries";
import { saveCharterMutation, SaveAddressMutation, saveStepsMutation } from "./mutations";
import { Parameters } from "@joincivil/utils"
import gql from "graphql-tag";
import { BigNumber } from "@joincivil/typescript-types";

export interface DataWrapperProps {
  children(props: NewsroomGqlProps): any;
}

export const parametersArray = [
  Parameters.minDeposit,
  Parameters.applyStageLen,
]

export const PARAMETERS_QUERY = gql`
  query Parameters($input: [String!]) {
    parameters: parameters(paramNames: $input) {
      paramName
      value
    }
  }
`;

export class DataWrapper extends React.Component<DataWrapperProps> {
  public render(): JSX.Element {
    return (
      <Query<any> query={PARAMETERS_QUERY} variables={{ input: parametersArray }}>
        {({ loading: paramsLoading, error: paramsError, data: paramsData }: { loading?: any, error?: any, data: any }) => {
          if (paramsLoading || paramsError) {
            return <></>
          }
          const minDeposit = new BigNumber(paramsData.parameters[0].value);
          const applyStageLen = new BigNumber(paramsData.parameters[1].value);
          return (
            <Query<any> query={userDataQuery}>
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
                  <Query<any> query={getCharterQuery}>
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
                      let tcrApplyTx: string;
                      if (charterData && charterData.nrsignupNewsroom) {
                        if (charterData.nrsignupNewsroom.charter) {
                          persistedCharter = charterData.nrsignupNewsroom.charter;
                        }
                        grantRequested = charterData.nrsignupNewsroom.grantRequested;
                        grantApproved = charterData.nrsignupNewsroom.grantApproved;
                        newsroomDeployTx = charterData.nrsignupNewsroom.newsroomDeployTx;
                        newsroomAddress = charterData.nrsignupNewsroom.newsroomAddress;
                        tcrApplyTx = charterData.nrsignupNewsroom.tcrApplyTx;
                      }

                      return (
                        <Mutation<any>
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
                                          tcrApplyTx,
                                          profileWalletAddress: userData.currentUser.ethAddress,
                                          savedStep: userData.currentUser.nrStep || 0,
                                          furthestStep: userData.currentUser.nrFurthestStep || 0,
                                          quizStatus: userData.currentUser.quizStatus,
                                          persistedCharter,
                                          saveAddress,
                                          saveSteps,
                                          persistCharter: this.saveCharterFuncFromMutation(saveCharter),
                                          minDeposit,
                                          applyStageLen
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
            )
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
