import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import styled, { StyledComponentClass } from "styled-components";
import BigNumber from "bignumber.js";
import { EthAddress } from "@joincivil/core";
import {
  colors,
  Tabs,
  Tab,
  DashboardActivity as DashboardActivityComponent,
  AllChallengesDashboardTabTitle,
  RevealVoteDashboardTabTitle,
  ClaimRewardsDashboardTabTitle,
  RescueTokensDashboardTabTitle,
  StyledDashboardSubTab,
  SubTabReclaimTokensText,
  Modal,
  ProgressModalContentMobileUnsupported,
} from "@joincivil/components";

import { State } from "../../redux/reducers";
import {
  getUserChallengesWithUnclaimedRewards,
  getUserChallengesWithUnrevealedVotes,
  getUserChallengesWithRescueTokens,
  getChallengesStartedByUser,
  getChallengesVotedOnByUser,
  getAppealChallengesVotedOnByUser,
  getUserAppealChallengesWithRescueTokens,
  getUserAppealChallengesWithUnrevealedVotes,
  getUserAppealChallengesWithUnclaimedRewards,
} from "../../selectors";

import ActivityList from "./ActivityList";
import MyTasks from "./MyTasks";
import ReclaimTokens from "./ReclaimTokens";
import ChallengesWithRewardsToClaim from "./ChallengesWithRewardsToClaim";
import ChallengesWithTokensToRescue from "./ChallengesWithTokensToRescue";
import DepositTokens from "./DepositTokens";

const TABS: string[] = ["tasks", "newsrooms", "challenges", "activity"];
const SUB_TABS: { [index: string]: string[] } = {
  tasks: ["all", "reveal-vote", "claim-rewards", "rescue-tokens", "transfer-voting-tokens"],
};

export interface DashboardActivityProps {
  match?: any;
  history: any;
}

export interface DashboardActivityReduxProps {
  currentUserNewsrooms: Set<string>;
  currentUserChallengesVotedOn: Set<string>;
  currentUserAppealChallengesVotedOn?: Set<string>;
  currentUserChallengesStarted: Set<string>;
  userChallengesWithUnclaimedRewards?: Set<string>;
  userChallengesWithUnrevealedVotes?: Set<string>;
  userChallengesWithRescueTokens?: Set<string>;
  userAppealChallengesWithUnclaimedRewards?: Set<string>;
  userAppealChallengesWithRescueTokens?: Set<string>;
  userAppealChallengesWithUnrevealedVotes?: Set<string>;
  userAccount: EthAddress;
}

export interface ChallengesToProcess {
  [index: string]: [boolean, BigNumber];
}

export interface DashboardActivityState {
  isNoMobileTransactionVisible: boolean;
  showTransferTokensMsg: boolean;
  activeTabIndex: number;
  activeSubTabIndex: number;
}

const StyledTabsComponent = styled.div`
  margin-left: 26px;
`;

export const StyledBatchButtonContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 12px 0 36px;
`;

const StyledTransferMessage = styled.div`
  background: ${colors.accent.CIVIL_RED_VERY_FADED};
  border-radius: 4px;
  border: 1px solid ${colors.accent.CIVIL_RED};
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 20px;
  margin: 24px 33px 20px;
  padding: 11px 28px 13px;
  text-align: center;
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
      showTransferTokensMsg: true,
      activeTabIndex: 0,
      activeSubTabIndex: 0,
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
    return <ActivityList listings={this.props.currentUserNewsrooms} />;
  };

  private renderUserChallenges = (): JSX.Element => {
    return <ActivityList challenges={this.props.currentUserChallengesStarted} />;
  };

  private renderUserVotes = (): JSX.Element => {
    const {
      currentUserChallengesVotedOn,
      currentUserAppealChallengesVotedOn,
      userChallengesWithUnclaimedRewards,
      userChallengesWithUnrevealedVotes,
      userChallengesWithRescueTokens,
      userAppealChallengesWithRescueTokens,
      userAppealChallengesWithUnrevealedVotes,
      userAppealChallengesWithUnclaimedRewards,
    } = this.props;
    const allVotesTabTitle = (
      <AllChallengesDashboardTabTitle
        count={currentUserChallengesVotedOn.count() + currentUserAppealChallengesVotedOn!.count()}
      />
    );
    const revealVoteTabTitle = (
      <RevealVoteDashboardTabTitle
        count={userChallengesWithUnrevealedVotes!.count() + userAppealChallengesWithUnrevealedVotes!.count()}
      />
    );
    const claimRewardsTabTitle = (
      <ClaimRewardsDashboardTabTitle
        count={userChallengesWithUnclaimedRewards!.count() + userAppealChallengesWithUnclaimedRewards!.count()}
      />
    );
    const rescueTokensTabTitle = (
      <RescueTokensDashboardTabTitle
        count={userChallengesWithRescueTokens!.count() + userAppealChallengesWithRescueTokens!.count()}
      />
    );

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
              challenges={currentUserChallengesVotedOn}
              appealChallenges={currentUserAppealChallengesVotedOn}
              showClaimRewardsTab={() => {
                this.setActiveSubTabIndex(2);
              }}
              showRescueTokensTab={() => {
                this.setActiveSubTabIndex(3);
              }}
            />
          </Tab>
          <Tab title={revealVoteTabTitle}>
            <ActivityList
              challenges={userChallengesWithUnrevealedVotes}
              appealChallenges={userAppealChallengesWithUnrevealedVotes}
            />
          </Tab>
          <Tab title={claimRewardsTabTitle}>
            <ChallengesWithRewardsToClaim
              challenges={userChallengesWithUnclaimedRewards}
              appealChallenges={userAppealChallengesWithUnclaimedRewards}
              onMobileTransactionClick={this.showNoMobileTransactionsModal}
            />
          </Tab>
          <Tab title={rescueTokensTabTitle}>
            <ChallengesWithTokensToRescue
              challenges={userChallengesWithRescueTokens}
              appealChallenges={userAppealChallengesWithRescueTokens}
              onMobileTransactionClick={this.showNoMobileTransactionsModal}
            />
          </Tab>
          <Tab title={<SubTabReclaimTokensText />}>
            <>
              {/* TODO(jon): the value of `showTransferTokensMsg` should be populated from the TokenController */}
              {this.state.showTransferTokensMsg && this.renderTransferTokensMsg()}
              <ReclaimTokens onMobileTransactionClick={this.showNoMobileTransactionsModal} />
              <DepositTokens />
            </>
          </Tab>
        </Tabs>
        {this.renderNoMobileTransactions()}
      </>
    );
  };

  private setActiveTabIndex = (activeTabIndex: number): void => {
    const tabName = TABS[activeTabIndex];
    this.props.history.push(`/dashboard/${tabName}`);
  };

  private setActiveSubTabIndex = (activeSubTabIndex: number): void => {
    const tabName = TABS[this.state.activeTabIndex];
    const subTabName = SUB_TABS[tabName][activeSubTabIndex];
    this.setState({ activeSubTabIndex });
    this.props.history.push(`/dashboard/${tabName}/${subTabName}`);
  };

  private showNoMobileTransactionsModal = (): void => {
    this.setState({ isNoMobileTransactionVisible: true });
  };

  private hideNoMobileTransactionsModal = (): void => {
    this.setState({ isNoMobileTransactionVisible: false });
  };

  private renderTransferTokensMsg(): JSX.Element {
    return (
      <StyledTransferMessage>
        Unlock your account by transfering at least 50% of your <b>available tokens</b> into your <b>voting balance</b>.
        Unlocking your account allow you to sell Civil tokens.
      </StyledTransferMessage>
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
  const currentUserChallengesVotedOn = getChallengesVotedOnByUser(state);
  const currentUserAppealChallengesVotedOn = getAppealChallengesVotedOnByUser(state);
  const currentUserChallengesStarted = getChallengesStartedByUser(state);
  const userChallengesWithUnclaimedRewards = getUserChallengesWithUnclaimedRewards(state);
  const userAppealChallengesWithUnclaimedRewards = getUserAppealChallengesWithUnclaimedRewards(state);
  const userChallengesWithUnrevealedVotes = getUserChallengesWithUnrevealedVotes(state);
  const userAppealChallengesWithUnrevealedVotes = getUserAppealChallengesWithUnrevealedVotes(state);

  const userChallengesWithRescueTokens = getUserChallengesWithRescueTokens(state);
  const userAppealChallengesWithRescueTokens = getUserAppealChallengesWithRescueTokens(state);

  return {
    currentUserNewsrooms,
    currentUserChallengesVotedOn,
    currentUserAppealChallengesVotedOn,
    currentUserChallengesStarted,
    userChallengesWithUnclaimedRewards,
    userChallengesWithUnrevealedVotes,
    userChallengesWithRescueTokens,
    userAppealChallengesWithUnclaimedRewards,
    userAppealChallengesWithUnrevealedVotes,
    userAppealChallengesWithRescueTokens,
    userAccount: user.account.account,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(DashboardActivity);
