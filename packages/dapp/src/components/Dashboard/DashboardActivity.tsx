import * as React from "react";
import { connect } from "react-redux";
import { Map, Set } from "immutable";
import styled, { StyledComponentClass } from "styled-components";
import BigNumber from "bignumber.js";
import { EthAddress } from "@joincivil/core";
import {
  DashboardActivity as DashboardActivityComponent,
  Modal,
  ProgressModalContentMobileUnsupported,
  NoNewsrooms,
} from "@joincivil/components";

import { dashboardTabs, dashboardSubTabs, TDashboardTab, TDashboardSubTab } from "../../constants";
import { State } from "../../redux/reducers";
import {
  getUserChallengesWithUnclaimedRewards,
  getUserChallengesWithUnrevealedVotes,
  getChallengesForAppealChallengesWithUnrevealedVotes,
  getUserChallengesWithRescueTokens,
  getCompletedChallengesVotedOnByUser,
  getCompletedChallengesForAppealChallengesVotedOnByUser,
  getChallengesStartedByUser,
  getChallengesVotedOnByUserWithAvailableActions,
  getChallengesForAppealChallengesVotedOnByUserWithAvailableActions,
  getUserAppealChallengesWithRescueTokens,
  getUserAppealChallengesWithUnclaimedRewards,
  getProposalChallengesWithAvailableActions,
  getProposalChallengesWithUnrevealedVotes,
  getProposalChallengesWithRescueTokens,
  getProposalChallengesWithUnclaimedRewards,
} from "../../selectors";
import {
  USER_CHALLENGE_DATA_POLL_TYPES,
  transformGraphQLDataIntoDashboardChallengesSet,
  transformGraphQLDataIntoDashboardChallengesByTypeSets,
  getUserChallengeDataSetByPollType,
} from "../../helpers/queryTransformations";

import NewsroomsList from "./NewsroomsList";
import MyTasks from "./MyTasks";
import MyChallenges from "./MyChallenges";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import LoadingMsg from "../utility/LoadingMsg";

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
  currentUserNewsrooms: Set<string>;
  allChallengesWithAvailableActions: Set<string>;
  allCompletedChallengesVotedOn: Set<string>;
  currentUserChallengesStarted: Set<string>;
  allChallengesWithUnrevealedVotes: Set<string>;
  userChallengesWithUnclaimedRewards?: Set<string>;
  userChallengesWithRescueTokens?: Set<string>;
  userAppealChallengesWithUnclaimedRewards?: Set<string>;
  userAppealChallengesWithRescueTokens?: Set<string>;
  proposalChallengesWithAvailableActions?: Set<string>;
  proposalChallengesWithUnrevealedVotes?: Set<string>;
  proposalChallengesWithUnclaimedRewards?: Set<string>;
  proposalChallengesWithRescueTokens?: Set<string>;
  userAccount: EthAddress;
  useGraphQL: boolean;
}

export interface ChallengesToProcess {
  [index: string]: [boolean, BigNumber];
}

export interface DashboardActivityState {
  isNoMobileTransactionVisible: boolean;
  activeTabIndex: number;
  activeSubTabIndex: number;
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

const NEWSROOMS_QUERY = gql`
  query {
    nrsignupNewsroom {
      newsroomAddress
      tcrApplyTx
    }
  }
`;

const DASHBOARD_USER_CHALLENGE_DATA_QUERY = gql`
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
  }
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
    }
    this.setState({ ...this.state, ...tabState });
  }

  public render(): JSX.Element {
    return (
      <>
        <DashboardActivityComponent
          userVotes={this.renderUserVotes()}
          userNewsrooms={this.renderUserNewsrooms()}
          userChallenges={this.renderUserChallenges()}
          activeIndex={this.state.activeTabIndex}
          onTabChange={this.setActiveTabIndex}
        />
        {this.renderNoMobileTransactions()}
      </>
    );
  }

  private renderUserNewsrooms = (): JSX.Element => {
    if (this.props.useGraphQL) {
      return (
        <Query query={NEWSROOMS_QUERY}>
          {({ loading, error, data }: any): JSX.Element => {
            if (loading && !data) {
              return <LoadingMsg />;
            }
            if (error) {
              return <NoNewsrooms />;
            }

            let newsrooms;
            let newsroomsApplicationProgressData;
            if (data.nrsignupNewsroom && data.nrsignupNewsroom.newsroomAddress) {
              newsrooms = Set([data.nrsignupNewsroom.newsroomAddress]);
              newsroomsApplicationProgressData = new Map();
              newsroomsApplicationProgressData = newsroomsApplicationProgressData.set(
                data.nrsignupNewsroom.newsroomAddress,
                data.nrsignupNewsroom,
              );
            }
            return (
              <NewsroomsList listings={newsrooms} newsroomsApplicationProgressData={newsroomsApplicationProgressData} />
            );
          }}
        </Query>
      );
    } else {
      return <NewsroomsList listings={this.props.currentUserNewsrooms} />;
    }
  };

  private renderUserChallenges = (): JSX.Element => {
    if (this.props.useGraphQL) {
      return (
        <Query query={DASHBOARD_USER_CHALLENGE_DATA_QUERY} variables={{ userAddress: this.props.userAccount }}>
          {({ loading, error, data }: any): JSX.Element => {
            if (error) {
              return <ErrorLoadingDataMsg />;
            }
            if (loading || !data) {
              return <LoadingMsg />;
            }
            if (data) {
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

              const { currentUserChallengesStarted } = this.props;

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
              };

              return <MyChallenges {...myTasksViewProps} useGraphQL={true} />;
            }
            return <LoadingMsg />;
          }}
        </Query>
      );
    } else {
      const {
        allCompletedChallengesVotedOn,
        proposalChallengesWithAvailableActions: allProposalChallengesVotedOn,
        currentUserChallengesStarted,
      } = this.props;

      const myTasksViewProps = {
        allCompletedChallengesVotedOn,
        allProposalChallengesVotedOn,
        currentUserChallengesStarted,
        activeSubTabIndex: this.state.activeSubTabIndex,
        setActiveSubTabIndex: this.setActiveSubTabIndex,
        showClaimRewardsTab: this.showClaimRewardsTab,
        showRescueTokensTab: this.showRescueTokensTab,
        showNoMobileTransactionsModal: this.showNoMobileTransactionsModal,
      };

      return <MyChallenges {...myTasksViewProps} />;
    }
  };

  private renderUserVotes = (): JSX.Element => {
    if (this.props.useGraphQL) {
      return (
        <Query query={DASHBOARD_USER_CHALLENGE_DATA_QUERY} variables={{ userAddress: this.props.userAccount }}>
          {({ loading, error, data, refetch }: any): JSX.Element => {
            const refetchUserChallengeData = (): void => {
              refetch();
            };

            if (error) {
              return <ErrorLoadingDataMsg />;
            }
            if (loading || !data) {
              return <LoadingMsg />;
            }
            if (data) {
              const allChallengesWithAvailableActions = transformGraphQLDataIntoDashboardChallengesSet(
                data.allChallenges,
              );
              const proposalChallengesWithAvailableActions = getUserChallengeDataSetByPollType(
                data.allChallenges,
                USER_CHALLENGE_DATA_POLL_TYPES.PARAMETER_PROPOSAL_CHALLENGE,
              );

              const allChallengesWithUnrevealedVotes = transformGraphQLDataIntoDashboardChallengesSet(
                data.challengesToReveal,
              );
              const proposalChallengesWithUnrevealedVotes = getUserChallengeDataSetByPollType(
                data.challengesToReveal,
                USER_CHALLENGE_DATA_POLL_TYPES.PARAMETER_PROPOSAL_CHALLENGE,
              );

              const allChallengesWithUnclaimedRewards: [
                Set<string>,
                Set<string>,
                Set<string>
              ] = transformGraphQLDataIntoDashboardChallengesByTypeSets(data.challengesWithRewards);

              const allChallengesWithRescueTokens: [
                Set<string>,
                Set<string>,
                Set<string>
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
              };

              return <MyTasks {...myTasksProps} useGraphQL={true} />;
            }
            return <LoadingMsg />;
          }}
        </Query>
      );
    } else {
      const {
        allChallengesWithAvailableActions,
        allChallengesWithUnrevealedVotes,
        userChallengesWithUnclaimedRewards,
        userChallengesWithRescueTokens,
        userAppealChallengesWithRescueTokens,
        userAppealChallengesWithUnclaimedRewards,
        proposalChallengesWithAvailableActions,
        proposalChallengesWithUnrevealedVotes,
        proposalChallengesWithUnclaimedRewards,
        proposalChallengesWithRescueTokens,
      } = this.props;

      const myTasksProps = {
        allChallengesWithAvailableActions,
        allChallengesWithUnrevealedVotes,
        userChallengesWithUnclaimedRewards,
        userChallengesWithRescueTokens,
        userAppealChallengesWithRescueTokens,
        userAppealChallengesWithUnclaimedRewards,
        proposalChallengesWithAvailableActions,
        proposalChallengesWithUnrevealedVotes,
        proposalChallengesWithUnclaimedRewards,
        proposalChallengesWithRescueTokens,
        activeSubTabIndex: this.state.activeSubTabIndex,
        setActiveSubTabIndex: this.setActiveSubTabIndex,
        showClaimRewardsTab: this.showClaimRewardsTab,
        showRescueTokensTab: this.showRescueTokensTab,
        showNoMobileTransactionsModal: this.showNoMobileTransactionsModal,
      };
      return <MyTasks {...myTasksProps} useGraphQL={false} />;
    }
  };

  private setActiveTabAndSubTabIndex = (activeTabIndex: number, activeSubTabIndex: number = 0): void => {
    const tabName = TABS[activeTabIndex];
    this.setState({ activeTabIndex, activeSubTabIndex });
    const subTabName =
      (SUB_TABS[tabName] && SUB_TABS[tabName]![activeSubTabIndex] && `/${SUB_TABS[tabName]![activeSubTabIndex]}`) || "";
    this.props.history.push(`/dashboard/${tabName}${subTabName}`);
  };

  private setActiveTabIndex = (activeTabIndex: number): void => {
    this.setActiveTabAndSubTabIndex(activeTabIndex);
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
  const { currentUserNewsrooms, user } = state.networkDependent;
  const { useGraphQL } = state;

  const currentUserChallengesVotedOnWithAvailableActions = getChallengesVotedOnByUserWithAvailableActions(state);
  const challengesForAppealChallengesVotedOnByUserWithAvailableActions = getChallengesForAppealChallengesVotedOnByUserWithAvailableActions(
    state,
  );
  const allChallengesWithAvailableActions = currentUserChallengesVotedOnWithAvailableActions.union(
    challengesForAppealChallengesVotedOnByUserWithAvailableActions,
  );
  const proposalChallengesWithAvailableActions = getProposalChallengesWithAvailableActions(state);

  const currentUserCompletedChallengesVotedOn = getCompletedChallengesVotedOnByUser(state);
  const currentUserCompletedChallengesForAppealChallengesVotedOnByUser = getCompletedChallengesForAppealChallengesVotedOnByUser(
    state,
  );
  const allCompletedChallengesVotedOn = currentUserCompletedChallengesVotedOn.union(
    currentUserCompletedChallengesForAppealChallengesVotedOnByUser,
  );

  const currentUserChallengesStarted = getChallengesStartedByUser(state);

  const userChallengesWithUnrevealedVotes = getUserChallengesWithUnrevealedVotes(state);
  const userChallengesForAppealChallengesWithUnrevealedVotes = getChallengesForAppealChallengesWithUnrevealedVotes(
    state,
  );
  const allChallengesWithUnrevealedVotes = userChallengesWithUnrevealedVotes.union(
    userChallengesForAppealChallengesWithUnrevealedVotes,
  );
  const proposalChallengesWithUnrevealedVotes = getProposalChallengesWithUnrevealedVotes(state);

  const userChallengesWithUnclaimedRewards = getUserChallengesWithUnclaimedRewards(state);
  const userAppealChallengesWithUnclaimedRewards = getUserAppealChallengesWithUnclaimedRewards(state);
  const proposalChallengesWithUnclaimedRewards = getProposalChallengesWithUnclaimedRewards(state);

  const userChallengesWithRescueTokens = getUserChallengesWithRescueTokens(state);
  const userAppealChallengesWithRescueTokens = getUserAppealChallengesWithRescueTokens(state);
  const proposalChallengesWithRescueTokens = getProposalChallengesWithRescueTokens(state);

  return {
    allChallengesWithAvailableActions,
    currentUserNewsrooms,
    allCompletedChallengesVotedOn,
    currentUserChallengesStarted,
    allChallengesWithUnrevealedVotes,
    userChallengesWithUnclaimedRewards,
    userChallengesWithRescueTokens,
    userAppealChallengesWithUnclaimedRewards,
    userAppealChallengesWithRescueTokens,
    proposalChallengesWithAvailableActions,
    proposalChallengesWithUnrevealedVotes,
    proposalChallengesWithUnclaimedRewards,
    proposalChallengesWithRescueTokens,
    userAccount: user.account.account,
    useGraphQL,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(DashboardActivity);
