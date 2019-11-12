import * as React from "react";
import { connect } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import { Map, Set } from "immutable";
import styled from "styled-components/macro";
import { BigNumber } from "@joincivil/typescript-types";
import { EthAddress } from "@joincivil/core";
import {
  DashboardActivity as DashboardActivityComponent,
  Modal,
  ProgressModalContentMobileUnsupported,
  NoNewsrooms,
  LoadingMessage,
  NoTasks,
  NoChallenges,
} from "@joincivil/components";

import { routes, dashboardTabs, dashboardSubTabs, TDashboardTab, TDashboardSubTab } from "../../constants";
import { State } from "../../redux/reducers";
import {
  USER_CHALLENGE_DATA_POLL_TYPES,
  transformGraphQLDataIntoDashboardChallengesSet,
  transformGraphQLDataIntoDashboardChallengesByTypeSets,
  getUserChallengeDataSetByPollType,
} from "../../helpers/queryTransformations";

import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import NewsroomsList from "./NewsroomsList";
import WithNewsroomChannelAdminList from "./ManageNewsroom/WithNewsroomChannelAdminList";
import MyTasks from "./MyTasks";
import MyChallenges from "./MyChallenges";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const TABS: TDashboardTab[] = [
  dashboardTabs.TASKS,
  dashboardTabs.NEWSROOMS,
  dashboardTabs.CHALLENGES,
  dashboardTabs.ACTIVITY,
];
const SUB_TABS: { [index in TDashboardTab]?: TDashboardSubTab[] } = {
  [dashboardTabs.TASKS]: [
    dashboardSubTabs.TASKS_ALL,
    dashboardSubTabs.TASKS_REVEAL_VOTE,
    dashboardSubTabs.TASKS_CLAIM_REWARDS,
    dashboardSubTabs.TASKS_RESCUE_TOKENS,
    dashboardSubTabs.TASKS_TRANSFER_VOTING_TOKENS,
  ],
  [dashboardTabs.CHALLENGES]: [dashboardSubTabs.CHALLENGES_COMPLETED, dashboardSubTabs.CHALLENGES_STAKED],
};

export interface DashboardActivityProps {
  match?: any;
  history: any;
}

export interface DashboardActivityReduxProps {
  userAccount: EthAddress;
}

export interface ChallengesToProcess {
  [index: string]: [boolean, BigNumber];
}

export interface DashboardActivityState {
  isNoMobileTransactionVisible: boolean;
  activeTabIndex: number;
  activeSubTabIndex: number;
  tabWasSet: boolean;
}

export const StyledTabsComponent = styled.div`
  margin-left: 26px;
`;

export const StyledBatchButtonContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 12px 0 36px;
`;

const NO_RESULTS = "No results from persister";
const NO_JSONB = "No jsonb found";

const USER_NRSIGNUP_QUERY = gql`
  query {
    nrsignupNewsroom: nrsignupNewsroom {
      charter {
        name
      }
      newsroomAddress
      tcrApplyTx
    }
  }
`;

const CHALLENGE_FRAGMENT = gql`
  fragment ChallengeFragment on Challenge {
    challengeID
    listingAddress
    listing {
      name
      owner
      ownerAddresses
      contractAddress
      whitelisted
      lastGovState
      lastUpdatedDate
      charter {
        uri
        contentID
        revisionID
        signature
        author
        contentHash
        timestamp
      }
      unstakedDeposit
      appExpiry
      approvalDate
    }
    statement
    rewardPool
    challenger
    resolved
    stake
    totalTokens
    poll {
      commitEndDate
      revealEndDate
      voteQuorum
      votesFor
      votesAgainst
    }
    requestAppealExpiry
    lastUpdatedDateTs
    appeal {
      requester
      appealFeePaid
      appealPhaseExpiry
      appealGranted
      appealOpenToChallengeExpiry
      statement
      appealChallengeID
      appealGrantedStatementURI
      appealChallenge {
        challengeID
        statement
        rewardPool
        challenger
        resolved
        stake
        totalTokens
        poll {
          commitEndDate
          revealEndDate
          voteQuorum
          votesFor
          votesAgainst
        }
      }
    }
  }
`;

const USER_CHALLENGE_DASHBOARD_QUERY = gql`
  query($userAddress: String!) {
    allChallenges: userChallengeData(userAddr: $userAddress) {
      pollID
      pollType
      userDidReveal
      userDidCommit
      didUserCollect
      didUserRescue
      didCollectAmount
      isVoterWinner
      pollIsPassed
      choice
      salt
      numTokens
      voterReward
      parentChallengeID
      challenge {
        ...ChallengeFragment
      }
    }
    challengesToReveal: userChallengeData(userAddr: $userAddress, canUserReveal: true) {
      pollID
      pollType
      parentChallengeID
    }
    challengesWithRewards: userChallengeData(userAddr: $userAddress, canUserCollect: true) {
      pollID
      pollType
    }
    challengesToRescue: userChallengeData(userAddr: $userAddress, canUserRescue: true) {
      pollID
      pollType
    }
    challengesStarted: challengesStartedByUser(addr: $userAddress) {
      ...ChallengeFragment
    }
  }
  ${CHALLENGE_FRAGMENT}
`;

// We're storing which challenges to multi-claim in the state of this component, because
// the user can select which rewards to batch
// @TODO(jon: Clean this up. Maybe this gets put into redux, or we create a more
// explicit type that describes this object that gets checked and that type has a field
// called something like `isSelected` so this code is a bit clearer
export const getChallengesToProcess = (challengeObj: ChallengesToProcess): BigNumber[] => {
  const challengesToCheck = Object.entries(challengeObj);
  const challengesToProcess: BigNumber[] = challengesToCheck
    .map((challengeToProcess: [string, [boolean, BigNumber]]) => {
      if (challengeToProcess[1][0]) {
        return new BigNumber(challengeToProcess[0]);
      }
      return;
    })
    .filter(item => !!item) as BigNumber[];
  return challengesToProcess;
};

export const getSalts = (challengeObj: ChallengesToProcess): BigNumber[] => {
  const challengesToCheck = Object.entries(challengeObj);
  const challengesToProcess: BigNumber[] = challengesToCheck
    .map((challengeToProcess: [string, [boolean, BigNumber]]) => {
      if (challengeToProcess[1][0]) {
        return challengeToProcess[1][1];
      }
      return;
    })
    .filter(item => !!item) as BigNumber[];
  return challengesToProcess;
};

class DashboardActivity extends React.Component<
  DashboardActivityProps & DashboardActivityReduxProps,
  DashboardActivityState
  > {
  public state = {
    isNoMobileTransactionVisible: false,
    activeTabIndex: 0,
    activeSubTabIndex: 0,
    tabWasSet: false,
  };

  public componentWillMount(): void {
    const { activeDashboardTab, activeDashboardSubTab } = this.props.match.params;
    const tabState: Partial<DashboardActivityState> = {};
    if (activeDashboardTab) {
      tabState.activeTabIndex = TABS.indexOf(activeDashboardTab) || 0;
      const subTabs = SUB_TABS[activeDashboardTab];
      if (activeDashboardSubTab && subTabs) {
        tabState.activeSubTabIndex = subTabs.indexOf(activeDashboardSubTab) || 0;
      }
      tabState.tabWasSet = true;
    }
    this.setState({ ...this.state, ...tabState });
  }

  public render(): JSX.Element {
    return (
      <WithNewsroomChannelAdminList>
        {({ newsrooms }) => {
          return (
            <Query query={USER_NRSIGNUP_QUERY}>
              {({ loading: nrsignupLoading, error: nrsignupError, data: nrsignupData }: any): JSX.Element => {
                return (
                  <Query query={USER_CHALLENGE_DASHBOARD_QUERY} variables={{ userAddress: this.props.userAccount }}>
                    {({
                      loading: challengeLoading,
                      error: challengeError,
                      data: challengeData,
                      refetch: challengeRefetch,
                    }: any): JSX.Element => {
                      if (nrsignupLoading || challengeLoading) {
                        console.log("loading.");
                        return <LoadingMessage />;
                      }
                      if (nrsignupError && !nrsignupError.toString().includes(NO_JSONB)) {
                        console.log("error loading user nrsignup: ", nrsignupError);
                        return <ErrorLoadingDataMsg />;
                      }
                      if (challengeError && !challengeError.toString().includes(NO_RESULTS)) {
                        console.log("error loading user challenges: ", challengeError);
                        return <ErrorLoadingDataMsg />;
                      }

                      const myChallengesViewProps = this.getMyChallengesViewProps(challengeError, challengeData);
                      const myTasksViewProps = this.getMyTasksViewProps(
                        challengeError,
                        challengeData,
                        challengeRefetch,
                      );

                      const numUserNewsrooms =
                        newsrooms.count() ||
                        (nrsignupData && nrsignupData.nrsignupNewsroom
                          && nrsignupData.nrsignupNewsroom.newsroomAddress ? 1 : 0);

                      return (
                        <>
                          <DashboardActivityComponent
                            userVotes={this.renderUserVotes(challengeError, myTasksViewProps)}
                            numUserVotes={myTasksViewProps.numUserTasks}
                            userNewsrooms={this.renderWithNrsignupNewsrooms(
                              newsrooms,
                              nrsignupError,
                              nrsignupData,
                            )}
                            numUserNewsrooms={numUserNewsrooms}
                            userChallenges={this.renderUserChallenges(challengeError, myChallengesViewProps)}
                            activeIndex={this.state.activeTabIndex}
                            onTabChange={this.setActiveTabIndex}
                            onTabsLoadChange={this.setActiveTabIndexNoHistoryPush}
                            preventStartingTabOverride={this.state.tabWasSet}
                          />
                          {this.renderNoMobileTransactions()}
                        </>
                      );
                    }}
                  </Query>
                );
              }}
            </Query>
          );
        }}
      </WithNewsroomChannelAdminList>
    );
  }

  private renderWithNrsignupNewsrooms = (channelNewsrooms: Set<any>, error: any, data: any): JSX.Element => {
    const registryUrl = formatRoute(routes.APPLY_TO_REGISTRY);

    if (!channelNewsrooms.size && (error || !data || !data.nrsignupNewsroom)) {
      return <NoNewsrooms applyToRegistryURL={registryUrl} />;
    }

    const newsrooms = channelNewsrooms;

    if (!newsrooms.size && data && data.nrsignupNewsroom) {
      return (<NoNewsrooms hasInProgressApplication={true} applyToRegistryURL={registryUrl} />)
    }

    if (!newsrooms.size) {
      return <NoNewsrooms applyToRegistryURL={registryUrl} />;
    }

    return (
      <>
        <NewsroomsList listings={newsrooms} />
      </>
    );
  };

  private getMyChallengesViewProps = (error: any, data: any): any => {
    if (error) {
      return {};
    }
    const allCompletedChallengesVotedOn = transformGraphQLDataIntoDashboardChallengesSet(data.allChallenges);
    const allProposalChallengesVotedOn = getUserChallengeDataSetByPollType(
      data.allChallenges,
      USER_CHALLENGE_DATA_POLL_TYPES.PARAMETER_PROPOSAL_CHALLENGE,
    );

    let userChallengeDataMap = Map<string, any>();
    let challengeToAppealChallengeMap = Map<string, string>();
    data.allChallenges.forEach((challengeData: any) => {
      userChallengeDataMap = userChallengeDataMap.set(challengeData.pollID, challengeData);
      if (challengeData.pollType === "APPEAL_CHALLENGE") {
        challengeToAppealChallengeMap = challengeToAppealChallengeMap.set(
          challengeData.parentChallengeID,
          challengeData.pollID,
        );
      }
    });

    const currentUserChallengesStarted = Set<any>(data.challengesStarted);
    console.log("currentUserChallengesStarted: ", currentUserChallengesStarted);

    const numUserChallenges =
      allCompletedChallengesVotedOn!.count() +
      allProposalChallengesVotedOn!.count() +
      currentUserChallengesStarted!.count();

    const myTasksViewProps = {
      userChallengeData: userChallengeDataMap,
      challengeToAppealChallengeMap,
      allCompletedChallengesVotedOn,
      allProposalChallengesVotedOn,
      currentUserChallengesStarted,
      activeSubTabIndex: this.state.activeSubTabIndex,
      setActiveSubTabIndex: this.setActiveSubTabIndex,
      showClaimRewardsTab: this.showClaimRewardsTab,
      showRescueTokensTab: this.showRescueTokensTab,
      showNoMobileTransactionsModal: this.showNoMobileTransactionsModal,
      numUserChallenges,
    };

    return myTasksViewProps;
  };

  private renderUserChallenges = (error: any, myTasksViewProps: any): JSX.Element => {
    if (error) {
      if (error.toString().includes(NO_RESULTS)) {
        return <NoChallenges />;
      } else {
        return <ErrorLoadingDataMsg />;
      }
    }

    return <MyChallenges {...myTasksViewProps} useGraphQL={true} />;
  };

  private getMyTasksViewProps = (error: any, data: any, refetch: any): any => {
    const refetchUserChallengeData = (): void => {
      refetch();
    };
    if (error) {
      return {};
    }
    const allChallengesWithAvailableActions = transformGraphQLDataIntoDashboardChallengesSet(
      data.allChallenges,
      true,
      data.challengesToReveal,
      data.challengesToRescue,
    );
    const proposalChallengesWithAvailableActions = getUserChallengeDataSetByPollType(
      data.allChallenges,
      USER_CHALLENGE_DATA_POLL_TYPES.PARAMETER_PROPOSAL_CHALLENGE,
      true,
    );

    const allChallengesWithUnrevealedVotes = transformGraphQLDataIntoDashboardChallengesSet(data.challengesToReveal);
    const proposalChallengesWithUnrevealedVotes = getUserChallengeDataSetByPollType(
      data.challengesToReveal,
      USER_CHALLENGE_DATA_POLL_TYPES.PARAMETER_PROPOSAL_CHALLENGE,
    );

    const allChallengesWithUnclaimedRewards: [
      Set<string>,
      Set<string>,
      Set<string>,
    ] = transformGraphQLDataIntoDashboardChallengesByTypeSets(data.challengesWithRewards);

    const allChallengesWithRescueTokens: [
      Set<string>,
      Set<string>,
      Set<string>,
    ] = transformGraphQLDataIntoDashboardChallengesByTypeSets(data.challengesToRescue);

    let userChallengeDataMap = Map<string, any>();
    let challengeToAppealChallengeMap = Map<string, string>();
    data.allChallenges.forEach((challengeData: any) => {
      userChallengeDataMap = userChallengeDataMap.set(challengeData.pollID, challengeData);
      if (challengeData.pollType === "APPEAL_CHALLENGE") {
        challengeToAppealChallengeMap = challengeToAppealChallengeMap.set(
          challengeData.parentChallengeID,
          challengeData.pollID,
        );
      }
    });

    const numUserTasks = allChallengesWithAvailableActions!.count() + proposalChallengesWithAvailableActions!.count();

    const myTasksProps = {
      userChallengeData: userChallengeDataMap,
      challengeToAppealChallengeMap,
      allChallengesWithAvailableActions,
      proposalChallengesWithAvailableActions,
      allChallengesWithUnrevealedVotes,
      proposalChallengesWithUnrevealedVotes,
      userChallengesWithUnclaimedRewards: allChallengesWithUnclaimedRewards[0],
      userAppealChallengesWithUnclaimedRewards: allChallengesWithUnclaimedRewards[1],
      proposalChallengesWithUnclaimedRewards: allChallengesWithUnclaimedRewards[2],
      userChallengesWithRescueTokens: allChallengesWithRescueTokens[0],
      userAppealChallengesWithRescueTokens: allChallengesWithRescueTokens[1],
      proposalChallengesWithRescueTokens: allChallengesWithRescueTokens[2],
      activeSubTabIndex: this.state.activeSubTabIndex,
      setActiveSubTabIndex: this.setActiveSubTabIndex,
      showClaimRewardsTab: this.showClaimRewardsTab,
      showRescueTokensTab: this.showRescueTokensTab,
      showNoMobileTransactionsModal: this.showNoMobileTransactionsModal,
      refetchUserChallengeData,
      numUserTasks,
    };

    return myTasksProps;
  };

  private renderUserVotes = (error: any, myTasksViewProps: any): JSX.Element => {
    if (error) {
      if (error.toString().includes(NO_RESULTS)) {
        return <NoTasks />;
      } else {
        return <ErrorLoadingDataMsg />;
      }
    }

    return <MyTasks {...myTasksViewProps} />;
  };

  private setActiveTabAndSubTabIndex = (activeTabIndex: number, activeSubTabIndex: number = 0, shouldPushHistory: boolean = true): void => {
    const tabName = TABS[activeTabIndex];
    this.setState({ activeTabIndex, activeSubTabIndex });
    const subTabName =
      (SUB_TABS[tabName] && SUB_TABS[tabName]![activeSubTabIndex] && `/${SUB_TABS[tabName]![activeSubTabIndex]}`) || "";
    if (shouldPushHistory) {
      this.props.history.push(`/dashboard/${tabName}${subTabName}`);
    }
  };

  private setActiveTabIndex = (activeTabIndex: number): void => {
    this.setActiveTabAndSubTabIndex(activeTabIndex);
  };

  private setActiveTabIndexNoHistoryPush = (activeTabIndex: number): void => {
    this.setActiveTabAndSubTabIndex(activeTabIndex, 0, false);
  };

  private setActiveSubTabIndex = (activeSubTabIndex: number): void => {
    this.setActiveTabAndSubTabIndex(this.state.activeTabIndex, activeSubTabIndex);
  };

  private showClaimRewardsTab = (): void => {
    const activeTabIndex = TABS.indexOf(dashboardTabs.TASKS);
    const activeSubTabIndex = SUB_TABS[dashboardTabs.TASKS]!.indexOf(dashboardSubTabs.TASKS_CLAIM_REWARDS);
    this.setActiveTabAndSubTabIndex(activeTabIndex, activeSubTabIndex);
  };

  private showRescueTokensTab = (): void => {
    const activeTabIndex = TABS.indexOf(dashboardTabs.TASKS);
    const activeSubTabIndex = SUB_TABS[dashboardTabs.TASKS]!.indexOf(dashboardSubTabs.TASKS_RESCUE_TOKENS);
    this.setActiveTabAndSubTabIndex(activeTabIndex, activeSubTabIndex);
  };

  private showNoMobileTransactionsModal = (): void => {
    this.setState({ isNoMobileTransactionVisible: true });
  };

  private hideNoMobileTransactionsModal = (): void => {
    this.setState({ isNoMobileTransactionVisible: false });
  };

  private renderNoMobileTransactions(): JSX.Element {
    if (this.state.isNoMobileTransactionVisible) {
      return (
        <Modal textAlign="center">
          <ProgressModalContentMobileUnsupported hideModal={this.hideNoMobileTransactionsModal} />
        </Modal>
      );
    }

    return <></>;
  }
}

const mapStateToProps = (
  state: State,
  ownProps: DashboardActivityProps,
): DashboardActivityProps & DashboardActivityReduxProps => {
  const { user } = state.networkDependent;

  return {
    userAccount: user.account.account,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(DashboardActivity);
