import * as React from "react";
import { Set } from "immutable";

import MyTasksList from "./MyTasksList";

import {
  Tabs,
  Tab,
  AllChallengesDashboardTabTitle,
  RevealVoteDashboardTabTitle,
  ClaimRewardsDashboardTabTitle,
  RescueTokensDashboardTabTitle,
  StyledDashboardSubTab,
  SubTabReclaimTokensText,
} from "@joincivil/components";

import { StyledTabsComponent } from "./DashboardActivity";
import ChallengesWithRewardsToClaim from "./ChallengesWithRewardsToClaim";
import ChallengesWithTokensToRescue from "./ChallengesWithTokensToRescue";
import TransferCivilTokens from "./TransferCivilTokens";

export interface MyTasksProps {
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
  activeSubTabIndex: number;
  setActiveSubTabIndex(): void;
  showClaimRewardsTab(): void;
  showRescueTokensTab(): void;
  showNoMobileTransactionsModal(): void;
}

const MyTasks: React.FunctionComponent<MyTasksProps> = props => {
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
    activeSubTabIndex,
    setActiveSubTabIndex,
    showClaimRewardsTab,
    showRescueTokensTab,
    showNoMobileTransactionsModal,
  } = props;

  console.log(allChallengesWithAvailableActions);

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

  return (
    <>
      <Tabs
        TabComponent={StyledDashboardSubTab}
        TabsNavComponent={StyledTabsComponent}
        activeIndex={activeSubTabIndex}
        onActiveTabChange={setActiveSubTabIndex}
      >
        <Tab title={allVotesTabTitle}>
          <MyTasksList
            challenges={allChallengesWithAvailableActions}
            proposalChallenges={proposalChallengesWithAvailableActions}
            showClaimRewardsTab={showClaimRewardsTab}
            showRescueTokensTab={showRescueTokensTab}
          />
        </Tab>
        <Tab title={revealVoteTabTitle}>
          <MyTasksList
            challenges={allChallengesWithUnrevealedVotes}
            proposalChallenges={proposalChallengesWithUnrevealedVotes}
            showClaimRewardsTab={showClaimRewardsTab}
            showRescueTokensTab={showRescueTokensTab}
          />
        </Tab>
        <Tab title={claimRewardsTabTitle}>
          <ChallengesWithRewardsToClaim
            challenges={userChallengesWithUnclaimedRewards}
            appealChallenges={userAppealChallengesWithUnclaimedRewards}
            proposalChallenges={proposalChallengesWithUnclaimedRewards}
            onMobileTransactionClick={showNoMobileTransactionsModal}
          />
        </Tab>
        <Tab title={rescueTokensTabTitle}>
          <ChallengesWithTokensToRescue
            challenges={userChallengesWithRescueTokens}
            appealChallenges={userAppealChallengesWithRescueTokens}
            proposalChallenges={proposalChallengesWithRescueTokens}
            onMobileTransactionClick={showNoMobileTransactionsModal}
          />
        </Tab>
        <Tab title={<SubTabReclaimTokensText />}>
          <TransferCivilTokens showNoMobileTransactionsModal={showNoMobileTransactionsModal} />
        </Tab>
      </Tabs>
    </>
  );
};

export default MyTasks;
