import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import styled, { StyledComponentClass } from "styled-components";
import BigNumber from "bignumber.js";
import { EthAddress } from "@joincivil/core";
import {
  Tabs,
  Tab,
  DashboardActivity as DashboardActivityComponent,
  AllChallengesDashboardTabTitle,
  RevealVoteDashboardTabTitle,
  ClaimRewardsDashboardTabTitle,
  RescueTokensDashboardTabTitle,
  ChallengesStakedDashboardTabTitle,
  ChallengesCompletedDashboardTabTitle,
  StyledDashboardSubTab,
  SubTabReclaimTokensText,
  Modal,
  ProgressModalContentMobileUnsupported,
  StyledDashboardActivityDescription,
  Notice,
  NoticeTypes,
  DashboardTransferTokenForm,
  DashboardTutorialWarning,
  BalanceType,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";

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

import NewsroomsList from "./NewsroomsList";
import MyTasks from "./MyTasks";
import ReclaimTokens from "./ReclaimTokens";
import ChallengesWithRewardsToClaim from "./ChallengesWithRewardsToClaim";
import ChallengesWithTokensToRescue from "./ChallengesWithTokensToRescue";
import DepositTokens from "./DepositTokens";
import { getCivilianWhitelist, getUnlockedWhitelist } from "../../helpers/tokenController";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import LoadingMsg from "../utility/LoadingMsg";
import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";

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
  balance: BigNumber;
  votingBalance: BigNumber;
  useGraphQL: boolean;
}

export interface ChallengesToProcess {
  [index: string]: [boolean, BigNumber];
}

export interface DashboardActivityState {
  isNoMobileTransactionVisible: boolean;
  activeTabIndex: number;
  activeSubTabIndex: number;
  fromBalanceType: number;
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
  constructor(props: DashboardActivityProps & DashboardActivityReduxProps) {
    super(props);
    this.state = {
      isNoMobileTransactionVisible: false,
      activeTabIndex: 0,
      activeSubTabIndex: 0,
      fromBalanceType: 0,
    };
  }

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
      <DashboardActivityComponent
        userVotes={this.renderUserVotes()}
        userNewsrooms={this.renderUserNewsrooms()}
        userChallenges={this.renderUserChallenges()}
        activeIndex={this.state.activeTabIndex}
        onTabChange={this.setActiveTabIndex}
      />
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
              return <ErrorLoadingDataMsg />;
            }
            const newsrooms =
              data.nrsignupNewsroom &&
              data.nrsignupNewsroom.newsroomAddress &&
              Set([data.nrsignupNewsroom.newsroomAddress]);
            return <NewsroomsList listings={newsrooms} />;
          }}
        </Query>
      );
    } else {
      return <NewsroomsList listings={this.props.currentUserNewsrooms} />;
    }
  };

  private renderUserChallenges = (): JSX.Element => {
    const { allCompletedChallengesVotedOn, currentUserChallengesStarted } = this.props;
    const completedChallengesTitle = (
      <ChallengesCompletedDashboardTabTitle count={allCompletedChallengesVotedOn.count()} />
    );
    const stakedChallengesTitle = <ChallengesStakedDashboardTabTitle count={currentUserChallengesStarted.count()} />;

    return (
      <>
        <Tabs
          TabComponent={StyledDashboardSubTab}
          TabsNavComponent={StyledTabsComponent}
          activeIndex={this.state.activeSubTabIndex}
          onActiveTabChange={this.setActiveSubTabIndex}
        >
          <Tab title={completedChallengesTitle}>
            <>
              <StyledDashboardActivityDescription>
                Summary of completed challenges you voted in
              </StyledDashboardActivityDescription>
              <MyTasks
                challenges={allCompletedChallengesVotedOn}
                showClaimRewardsTab={() => {
                  this.showClaimRewardsTab();
                }}
                showRescueTokensTab={() => {
                  this.showRescueTokensTab();
                }}
              />
            </>
          </Tab>
          <Tab title={stakedChallengesTitle}>
            <>
              <StyledDashboardActivityDescription>Challenges you created</StyledDashboardActivityDescription>
              <MyTasks
                challenges={currentUserChallengesStarted}
                showClaimRewardsTab={() => {
                  this.showClaimRewardsTab();
                }}
                showRescueTokensTab={() => {
                  this.showRescueTokensTab();
                }}
              />
            </>
          </Tab>
        </Tabs>
        {this.renderNoMobileTransactions()}
      </>
    );
  };

  private renderUserVotes = (): JSX.Element => {
    const {
      allChallengesWithAvailableActions,
      userChallengesWithUnclaimedRewards,
      allChallengesWithUnrevealedVotes,
      userChallengesWithRescueTokens,
      userAppealChallengesWithRescueTokens,
      userAppealChallengesWithUnclaimedRewards,
      proposalChallengesWithAvailableActions,
      proposalChallengesWithUnrevealedVotes,
      proposalChallengesWithUnclaimedRewards,
      proposalChallengesWithRescueTokens,
    } = this.props;
    const allVotesTabTitle = (
      <AllChallengesDashboardTabTitle
        count={allChallengesWithAvailableActions.count() + proposalChallengesWithAvailableActions!.count()}
      />
    );
    const revealVoteTabTitle = (
      <RevealVoteDashboardTabTitle
        count={allChallengesWithUnrevealedVotes.count() + proposalChallengesWithUnrevealedVotes!.count()}
      />
    );
    const claimRewardsTabTitle = (
      <ClaimRewardsDashboardTabTitle
        count={
          userChallengesWithUnclaimedRewards!.count() +
          userAppealChallengesWithUnclaimedRewards!.count() +
          proposalChallengesWithUnclaimedRewards!.count()
        }
      />
    );
    const rescueTokensTabTitle = (
      <RescueTokensDashboardTabTitle
        count={
          userChallengesWithRescueTokens!.count() +
          userAppealChallengesWithRescueTokens!.count() +
          proposalChallengesWithRescueTokens!.count()
        }
      />
    );
    const balance = getFormattedTokenBalance(this.props.balance);
    const votingBalance = getFormattedTokenBalance(this.props.votingBalance);
    const isCivilianWhitelist = getCivilianWhitelist(this.props.userAccount);
    const isUnlockedWhitelist = getUnlockedWhitelist(this.props.userAccount);

    return (
      <>
        <Tabs
          TabComponent={StyledDashboardSubTab}
          TabsNavComponent={StyledTabsComponent}
          activeIndex={this.state.activeSubTabIndex}
          onActiveTabChange={this.setActiveSubTabIndex}
        >
          <Tab title={allVotesTabTitle}>
            <MyTasks
              challenges={allChallengesWithAvailableActions}
              proposalChallenges={proposalChallengesWithAvailableActions}
              showClaimRewardsTab={() => {
                this.showClaimRewardsTab();
              }}
              showRescueTokensTab={() => {
                this.showRescueTokensTab();
              }}
            />
          </Tab>
          <Tab title={revealVoteTabTitle}>
            <MyTasks
              challenges={allChallengesWithUnrevealedVotes}
              proposalChallenges={proposalChallengesWithUnrevealedVotes}
              showClaimRewardsTab={() => {
                this.showClaimRewardsTab();
              }}
              showRescueTokensTab={() => {
                this.showRescueTokensTab();
              }}
            />
          </Tab>
          <Tab title={claimRewardsTabTitle}>
            <ChallengesWithRewardsToClaim
              challenges={userChallengesWithUnclaimedRewards}
              appealChallenges={userAppealChallengesWithUnclaimedRewards}
              proposalChallenges={proposalChallengesWithUnclaimedRewards}
              onMobileTransactionClick={this.showNoMobileTransactionsModal}
            />
          </Tab>
          <Tab title={rescueTokensTabTitle}>
            <ChallengesWithTokensToRescue
              challenges={userChallengesWithRescueTokens}
              appealChallenges={userAppealChallengesWithRescueTokens}
              proposalChallenges={proposalChallengesWithRescueTokens}
              onMobileTransactionClick={this.showNoMobileTransactionsModal}
            />
          </Tab>
          <Tab title={<SubTabReclaimTokensText />}>
            <>
              {!isUnlockedWhitelist && this.renderTransferTokensMsg()}

              {isCivilianWhitelist ? (
                <DashboardTransferTokenForm
                  renderTransferBalance={this.renderTransferBalance}
                  cvlAvailableBalance={balance}
                  cvlVotingBalance={votingBalance}
                >
                  {this.state.fromBalanceType === BalanceType.AVAILABLE_BALANCE ? (
                    <DepositTokens />
                  ) : (
                    <ReclaimTokens onMobileTransactionClick={this.showNoMobileTransactionsModal} />
                  )}
                </DashboardTransferTokenForm>
              ) : (
                <DashboardTutorialWarning />
              )}
            </>
          </Tab>
        </Tabs>
        {this.renderNoMobileTransactions()}
      </>
    );
  };

  private renderTransferBalance = (value: number) => {
    this.setState({ fromBalanceType: value });
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

  private renderTransferTokensMsg(): JSX.Element {
    return (
      <StyledDashboardActivityDescription noBorder={true}>
        <Notice type={NoticeTypes.ERROR}>
          Unlock your account by transfering at least 50% of your <b>available tokens</b> into your{" "}
          <b>voting balance</b>. Unlocking your account allow you to sell Civil tokens.
        </Notice>
      </StyledDashboardActivityDescription>
    );
  }

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

  let balance = new BigNumber(0);
  if (user.account && user.account.balance) {
    balance = user.account.balance;
  }
  let votingBalance = new BigNumber(0);
  if (user.account && user.account.votingBalance) {
    votingBalance = user.account.votingBalance;
  }

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
    balance,
    votingBalance,
    useGraphQL,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(DashboardActivity);
