import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { EthAddress, TwoStepEthTransaction } from "@joincivil/core";
import {
  Tabs,
  Tab,
  DashboardActivity as DashboardActivityComponent,
  AllChallengesDashboardTabTitle,
  RevealVoteDashboardTabTitle,
  ClaimRewardsDashboardTabTitle,
  RescueTokensDashboardTabTitle,
  StyledDashboardSubTab,
  StyledDashboardActivityDescription,
  SubTabReclaimTokensText,
  ClaimRewardsDescriptionText,
  RescueTokensDescriptionText,
  TransactionButton,
} from "@joincivil/components";
import { multiClaimRewards, rescueTokensInMultiplePolls } from "../../apis/civilTCR";
import { State } from "../../redux/reducers";
import {
  getUserChallengesWithUnclaimedRewards,
  getUserChallengesWithUnrevealedVotes,
  getUserChallengesWithRescueTokens,
  getChallengesStartedByUser,
  getChallengesVotedOnByUser,
} from "../../selectors";
import ActivityList from "./ActivityList";
import ReclaimTokens from "./ReclaimTokens";

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
  userAccount: EthAddress;
}

export interface ChallengesToProcess {
  [index: string]: [boolean, BigNumber];
}

export interface DashboardActivityState {
  challengesToClaim: ChallengesToProcess;
  challengesToRescue: ChallengesToProcess;
}

const StyledTabsComponent = styled.div`
  margin-left: 26px;
`;

const StyledBatchButtonContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 12px 0 36px;
`;

class DashboardActivity extends React.Component<
  DashboardActivityProps & DashboardActivityReduxProps,
  DashboardActivityState
> {
  constructor(props: DashboardActivityProps & DashboardActivityReduxProps) {
    super(props);
    this.state = {
      challengesToClaim: {},
      challengesToRescue: {},
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
    } = this.props;
    const allVotesTabTitle = <AllChallengesDashboardTabTitle count={currentUserChallengesVotedOn.count()} />;
    const revealVoteTabTitle = <RevealVoteDashboardTabTitle count={userChallengesWithUnrevealedVotes!.count()} />;
    const claimRewardsTabTitle = <ClaimRewardsDashboardTabTitle count={userChallengesWithUnclaimedRewards!.count()} />;
    const rescueTokensTabTitle = <RescueTokensDashboardTabTitle count={userChallengesWithRescueTokens!.count()} />;
    return (
      <Tabs
        TabComponent={StyledDashboardSubTab}
        TabsNavComponent={StyledTabsComponent}
        onActiveTabChange={this.onSubTabChange}
      >
        <Tab title={allVotesTabTitle}>
          <ActivityList challenges={currentUserChallengesVotedOn} />
        </Tab>
        <Tab title={revealVoteTabTitle}>
          <ActivityList challenges={userChallengesWithUnrevealedVotes} />
        </Tab>
        <Tab title={claimRewardsTabTitle}>
          <>
            <StyledDashboardActivityDescription>
              <ClaimRewardsDescriptionText />
            </StyledDashboardActivityDescription>
            <ActivityList
              challenges={userChallengesWithUnclaimedRewards}
              resolvedChallenges={true}
              toggleChallengeSelect={this.setChallengesToMultiClaim}
            />
            <StyledBatchButtonContainer>
              <TransactionButton transactions={[{ transaction: this.multiClaim }]}>Claim Rewards</TransactionButton>
            </StyledBatchButtonContainer>
          </>
        </Tab>
        <Tab title={rescueTokensTabTitle}>
          <>
            <StyledDashboardActivityDescription>
              <RescueTokensDescriptionText />
            </StyledDashboardActivityDescription>
            <ActivityList
              challenges={userChallengesWithRescueTokens}
              resolvedChallenges={true}
              toggleChallengeSelect={this.setChallengesToMultiRescue}
            />
            <StyledBatchButtonContainer>
              <TransactionButton transactions={[{ transaction: this.multiRescue }]}>Rescue Tokens</TransactionButton>
            </StyledBatchButtonContainer>
          </>
        </Tab>
        <Tab title={<SubTabReclaimTokensText />}>
          <>
            <ReclaimTokens />
          </>
        </Tab>
      </Tabs>
    );
  };

  private onTabChange = (activeIndex: number = 0): void => {
    const tabName = TABS[activeIndex];
    this.props.history.push(`/dashboard/${tabName}`);
    this.resetMultiClaimRescue();
  };

  private onSubTabChange = (activeIndex: number = 0): void => {
    this.resetMultiClaimRescue();
  };

  private setChallengesToMultiClaim = (challengeID: string, isSelected: boolean, salt: BigNumber): void => {
    this.setState(() => ({
      challengesToClaim: { ...this.state.challengesToClaim, [challengeID]: [isSelected, salt] },
    }));
  };

  private setChallengesToMultiRescue = (challengeID: string, isSelected: boolean, salt: BigNumber): void => {
    this.setState(() => ({
      challengesToRescue: { ...this.state.challengesToRescue, [challengeID]: [isSelected, salt] },
    }));
  };

  private resetMultiClaimRescue = (): void => {
    this.setState(() => ({ challengesToClaim: {}, challengesToRescue: {} }));
  };

  private multiClaim = async (): Promise<TwoStepEthTransaction | void> => {
    const challengeIDs = this.getChallengesToProcess(this.state.challengesToClaim);
    const salts = this.getSalts(this.state.challengesToClaim);
    return multiClaimRewards(challengeIDs, salts);
  };

  private multiRescue = async (): Promise<TwoStepEthTransaction | void> => {
    const challengeIDs = this.getChallengesToProcess(this.state.challengesToRescue);
    return rescueTokensInMultiplePolls(challengeIDs);
  };

  // We're storing which challenges to multi-claim in the state of this component, because
  // the user can select which rewards to batch
  // @TODO(jon: Clean this up. Maybe this gets put into redux, or we create a more
  // explicit type that describes this object that gets checked and that type has a field
  // called something like `isSelected` so this code is a bit clearer
  private getChallengesToProcess = (challengeObj: ChallengesToProcess): BigNumber[] => {
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

  private getSalts = (challengeObj: ChallengesToProcess): BigNumber[] => {
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

  return {
    currentUserNewsrooms,
    currentUserChallengesVotedOn,
    currentUserChallengesStarted,
    userChallengesWithUnclaimedRewards,
    userChallengesWithUnrevealedVotes,
    userChallengesWithRescueTokens,
    userAccount: user.account.account,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(DashboardActivity);
