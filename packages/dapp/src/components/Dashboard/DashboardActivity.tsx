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
  TransactionButton,
} from "@joincivil/components";
import { multiClaimRewards } from "../../apis/civilTCR";
import { State } from "../../reducers";
import {
  makeGetUserChallengesWithUnclaimedRewards,
  makeGetUserChallengesWithUnrevealedVotes,
  makeGetUserChallengesWithRescueTokens,
} from "../../selectors";
import ActivityList from "./ActivityList";

export interface DashboardActivityProps {
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

class DashboardActivity extends React.Component<DashboardActivityProps, DashboardActivityState> {
  constructor(props: DashboardActivityProps) {
    super(props);
    this.state = {
      challengesToClaim: {},
    };
  }

  public render(): JSX.Element {
    return (
      <DashboardActivityComponent
        userVotes={this.renderUserVotes()}
        userNewsrooms={this.renderUserNewsrooms()}
        userChallenges={this.renderUserChallenges()}
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
        onActiveTabChange={this.onTabChange}
      >
        <Tab title={allVotesTabTitle}>
          <ActivityList challenges={currentUserChallengesVotedOn} />
        </Tab>
        <Tab title={revealVoteTabTitle}>
          <ActivityList challenges={userChallengesWithUnrevealedVotes} />
        </Tab>
        <Tab title={claimRewardsTabTitle}>
          <>
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
          <ActivityList challenges={userChallengesWithRescueTokens} />
        </Tab>
      </Tabs>
    );
  };

  private onTabChange = (activeIndex: number = 0): void => {
    this.resetMultiClaimRescue();
  };

  private setChallengesToMultiClaim = (challengeID: string, isSelected: boolean, salt: BigNumber): void => {
    this.setState(() => ({
      challengesToClaim: { ...this.state.challengesToClaim, [challengeID]: [isSelected, salt] },
    }));
  };

  private resetMultiClaimRescue = (): void => {
    this.setState(() => ({ challengesToClaim: {} }));
  };

  private multiClaim = async (): Promise<TwoStepEthTransaction | void> => {
    const challengeIDs = this.getChallengesToProcess(this.state.challengesToClaim);
    const salts = this.getSalts(this.state.challengesToClaim);
    return multiClaimRewards(challengeIDs, salts);
  };

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

const makeMapStateToProps = () => {
  const getUserChallengesWithUnclaimedRewards = makeGetUserChallengesWithUnclaimedRewards();
  const getUserChallengesWithUnrevealedVotes = makeGetUserChallengesWithUnrevealedVotes();
  const getUserChallengesWithRescueTokens = makeGetUserChallengesWithRescueTokens();

  const mapStateToProps = (state: State): DashboardActivityProps => {
    const { currentUserNewsrooms, challengesVotedOnByUser, challengesStartedByUser, user } = state.networkDependent;
    let currentUserChallengesVotedOn = Set<string>();
    if (user.account && challengesVotedOnByUser.has(user.account.account)) {
      currentUserChallengesVotedOn = challengesVotedOnByUser.get(user.account.account);
    }
    let currentUserChallengesStarted = Set<string>();
    if (user.account && challengesStartedByUser.has(user.account.account)) {
      currentUserChallengesStarted = challengesStartedByUser.get(user.account.account);
    }

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
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(DashboardActivity);
