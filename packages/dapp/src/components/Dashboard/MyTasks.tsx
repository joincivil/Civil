import * as React from "react";
import { Map, Set } from "immutable";

import MyTasksList from "./MyTasksList";

import {
  RevealVoteDashboardTabTitle,
  ClaimRewardsDashboardTabTitle,
  RescueTokensDashboardTabTitle,
  Collapsable,
  SmallStyledCollapsibleContainerHeader,
} from "@joincivil/components";

import ChallengesWithRewardsToClaim from "./ChallengesWithRewardsToClaim";
import ChallengesWithTokensToRescue from "./ChallengesWithTokensToRescue";
// import TransferCivilTokens from "./TransferCivilTokens";

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
  userChallengeData?: Map<string, any>;
  challengeToAppealChallengeMap?: Map<string, string>;
  activeSubTabIndex: number;
  setActiveSubTabIndex(activeSubIndex: number): void;
  showClaimRewardsTab(): void;
  showRescueTokensTab(): void;
  showNoMobileTransactionsModal(): void;
  refetchUserChallengeData?(): void;
}

const MyTasks: React.FunctionComponent<MyTasksProps> = props => {
  const {
    allChallengesWithUnrevealedVotes,
    userChallengesWithUnclaimedRewards,
    userChallengesWithRescueTokens,
    userAppealChallengesWithRescueTokens,
    userAppealChallengesWithUnclaimedRewards,
    proposalChallengesWithUnrevealedVotes,
    proposalChallengesWithUnclaimedRewards,
    proposalChallengesWithRescueTokens,
    showClaimRewardsTab,
    showRescueTokensTab,
    showNoMobileTransactionsModal,
    userChallengeData,
    challengeToAppealChallengeMap,
    refetchUserChallengeData,
  } = props;

  const revealTasksCount = allChallengesWithUnrevealedVotes.count() + proposalChallengesWithUnrevealedVotes!.count();
  const revealVoteTabTitle = <RevealVoteDashboardTabTitle count={revealTasksCount} />;

  const claimRewardsCount =
    userChallengesWithUnclaimedRewards!.count() +
    userAppealChallengesWithUnclaimedRewards!.count() +
    proposalChallengesWithUnclaimedRewards!.count();
  const claimRewardsTabTitle = <ClaimRewardsDashboardTabTitle count={claimRewardsCount} />;

  const rescueTokensCount =
    userChallengesWithRescueTokens!.count() +
    userAppealChallengesWithRescueTokens!.count() +
    proposalChallengesWithRescueTokens!.count();
  const rescueTokensTabTitle = <RescueTokensDashboardTabTitle count={rescueTokensCount} />;

  return (
    <>
      <Collapsable
        header={revealVoteTabTitle}
        headerWrapper={SmallStyledCollapsibleContainerHeader}
        open={revealTasksCount > 0}
      >
        <MyTasksList
          challenges={allChallengesWithUnrevealedVotes}
          proposalChallenges={proposalChallengesWithUnrevealedVotes}
          userChallengeData={userChallengeData}
          challengeToAppealChallengeMap={challengeToAppealChallengeMap}
          refetchUserChallengeData={refetchUserChallengeData}
          showClaimRewardsTab={showClaimRewardsTab}
          showRescueTokensTab={showRescueTokensTab}
        />
      </Collapsable>
      <Collapsable
        header={claimRewardsTabTitle}
        headerWrapper={SmallStyledCollapsibleContainerHeader}
        open={claimRewardsCount > 0}
      >
        <ChallengesWithRewardsToClaim
          challenges={userChallengesWithUnclaimedRewards}
          appealChallenges={userAppealChallengesWithUnclaimedRewards}
          proposalChallenges={proposalChallengesWithUnclaimedRewards}
          userChallengeData={userChallengeData}
          refetchUserChallengeData={refetchUserChallengeData}
          onMobileTransactionClick={showNoMobileTransactionsModal}
        />
      </Collapsable>
      <Collapsable
        header={rescueTokensTabTitle}
        headerWrapper={SmallStyledCollapsibleContainerHeader}
        open={rescueTokensCount > 0}
      >
        <ChallengesWithTokensToRescue
          challenges={userChallengesWithRescueTokens}
          appealChallenges={userAppealChallengesWithRescueTokens}
          proposalChallenges={proposalChallengesWithRescueTokens}
          userChallengeData={userChallengeData}
          refetchUserChallengeData={refetchUserChallengeData}
          onMobileTransactionClick={showNoMobileTransactionsModal}
        />
      </Collapsable>
    </>
  );
};

{
  /* <Collapsable header={<SubTabReclaimTokensText />} headerWrapper={SmallStyledCollapsibleContainerHeader} open={false}>
  <TransferCivilTokens showNoMobileTransactionsModal={showNoMobileTransactionsModal} />
</Collapsable> */
}

export default MyTasks;
