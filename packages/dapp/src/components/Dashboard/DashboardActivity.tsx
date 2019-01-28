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
  getUserAppealChallengesWithRescueTokens,
} from "../../selectors";

import ActivityList from "./ActivityList";
import ReclaimTokens from "./ReclaimTokens";
import ChallengesWithRewardsToClaim from "./ChallengesWithRewardsToClaim";
import ChallengesWithTokensToRescue from "./ChallengesWithTokensToRescue";
import DepositTokens from "./DepositTokens";

const TABS: string[] = ["tasks", "newsrooms", "challenges", "activity"];

export interface DashboardActivityProps {
  match?: any;
  history: any;
}

export interface DashboardActivityReduxProps {
  currentUserNewsrooms: Set<string>;
  currentUserChallengesVotedOn: Set<string>;
  currentUserChallengesStarted: Set<string>;
  userChallengesWithUnclaimedRewards?: Set<string>;
  userChallengesWithUnrevealedVotes?: Set<string>;
  userChallengesWithRescueTokens?: Set<string>;
  userAppealChallengesWithRescueTokens?: Set<string>;
  userAccount: EthAddress;
}

export interface ChallengesToProcess {
  [index: string]: [boolean, BigNumber];
}

export interface DashboardActivityState {
  isNoMobileTransactionVisible: boolean;
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
    };
  }

  public render(): JSX.Element {
    const { activeDashboardTab } = this.props.match.params;
    let activeIndex = 0;
    if (activeDashboardTab) {
      activeIndex = TABS.indexOf(activeDashboardTab) || 0;
    }
    return (
      <DashboardActivityComponent
        userVotes={this.renderUserVotes()}
        userNewsrooms={this.renderUserNewsrooms()}
        userChallenges={this.renderUserChallenges()}
        activeIndex={activeIndex}
        onTabChange={this.onTabChange}
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
      userChallengesWithUnclaimedRewards,
      userChallengesWithUnrevealedVotes,
      userChallengesWithRescueTokens,
      userAppealChallengesWithRescueTokens,
    } = this.props;
    const allVotesTabTitle = <AllChallengesDashboardTabTitle count={currentUserChallengesVotedOn.count()} />;
    const revealVoteTabTitle = <RevealVoteDashboardTabTitle count={userChallengesWithUnrevealedVotes!.count()} />;
    const claimRewardsTabTitle = <ClaimRewardsDashboardTabTitle count={userChallengesWithUnclaimedRewards!.count()} />;
    const rescueTokensTabTitle = (
      <RescueTokensDashboardTabTitle
        count={userChallengesWithRescueTokens!.count() + userAppealChallengesWithRescueTokens!.count()}
      />
    );

    return (
      <>
        <Tabs TabComponent={StyledDashboardSubTab} TabsNavComponent={StyledTabsComponent}>
          <Tab title={allVotesTabTitle}>
            <ActivityList challenges={currentUserChallengesVotedOn} />
          </Tab>
          <Tab title={revealVoteTabTitle}>
            <ActivityList challenges={userChallengesWithUnrevealedVotes} />
          </Tab>
          <Tab title={claimRewardsTabTitle}>
            <ChallengesWithRewardsToClaim
              challenges={userChallengesWithUnclaimedRewards}
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
              <ReclaimTokens onMobileTransactionClick={this.showNoMobileTransactionsModal} />
              <DepositTokens />
            </>
          </Tab>
        </Tabs>
        {this.renderNoMobileTransactions()}
      </>
    );
  };

  private onTabChange = (activeIndex: number = 0): void => {
    const tabName = TABS[activeIndex];
    this.props.history.push(`/dashboard/${tabName}`);
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
  const currentUserChallengesVotedOn = getChallengesVotedOnByUser(state);
  const currentUserChallengesStarted = getChallengesStartedByUser(state);
  const userChallengesWithUnclaimedRewards = getUserChallengesWithUnclaimedRewards(state);
  const userChallengesWithUnrevealedVotes = getUserChallengesWithUnrevealedVotes(state);

  const userChallengesWithRescueTokens = getUserChallengesWithRescueTokens(state);
  const userAppealChallengesWithRescueTokens = getUserAppealChallengesWithRescueTokens(state);

  return {
    currentUserNewsrooms,
    currentUserChallengesVotedOn,
    currentUserChallengesStarted,
    userChallengesWithUnclaimedRewards,
    userChallengesWithUnrevealedVotes,
    userChallengesWithRescueTokens,
    userAppealChallengesWithRescueTokens,
    userAccount: user.account.account,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(DashboardActivity);
