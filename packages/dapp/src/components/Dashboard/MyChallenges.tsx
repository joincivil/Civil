import * as React from "react";
import { Map, Set } from "immutable";
import {
  ChallengesStakedDashboardTabTitle,
  ChallengesCompletedDashboardTabTitle,
  Collapsable,
  SmallStyledCollapsibleContainerHeader,
} from "@joincivil/components";
import MyTasksList from "./MyTasksList";

export interface MyChallengesProps {
  allCompletedChallengesVotedOn: Set<string>;
  allProposalChallengesVotedOn?: Set<string>;
  currentUserChallengesStarted: Set<string>;
  userChallengeData?: Map<string, any>;
  challengeToAppealChallengeMap?: Map<string, string>;
  activeSubTabIndex: number;
  useGraphQL?: boolean;
  setActiveSubTabIndex(activeSubIndex: number): void;
  showClaimRewardsTab(): void;
  showRescueTokensTab(): void;
  showNoMobileTransactionsModal(): void;
}

const MyChallenges: React.FunctionComponent<MyChallengesProps> = props => {
  const {
    allCompletedChallengesVotedOn,
    allProposalChallengesVotedOn,
    currentUserChallengesStarted,
    userChallengeData,
    challengeToAppealChallengeMap,
    useGraphQL,
    showClaimRewardsTab,
    showRescueTokensTab,
  } = props;

  const completedChallengesCount = allCompletedChallengesVotedOn.count();
  const completedChallengesTitle = <ChallengesCompletedDashboardTabTitle count={completedChallengesCount} />;

  const challengesStartedCount = currentUserChallengesStarted.count();
  const stakedChallengesTitle = <ChallengesStakedDashboardTabTitle count={challengesStartedCount} />;

  return (
    <>
      <Collapsable
        header={completedChallengesTitle}
        headerWrapper={SmallStyledCollapsibleContainerHeader}
        open={completedChallengesCount > 0}
      >
        <>
          <MyTasksList
            challenges={allCompletedChallengesVotedOn}
            proposalChallenges={allProposalChallengesVotedOn}
            userChallengeData={userChallengeData}
            challengeToAppealChallengeMap={challengeToAppealChallengeMap}
            useGraphQL={useGraphQL}
            showClaimRewardsTab={showClaimRewardsTab}
            showRescueTokensTab={showRescueTokensTab}
          />
        </>
      </Collapsable>
      <Collapsable
        header={stakedChallengesTitle}
        headerWrapper={SmallStyledCollapsibleContainerHeader}
        open={challengesStartedCount > 0}
      >
        <>
          <MyTasksList
            userChallengeData={userChallengeData}
            challenges={currentUserChallengesStarted}
            showClaimRewardsTab={showClaimRewardsTab}
            showRescueTokensTab={showRescueTokensTab}
          />
        </>
      </Collapsable>
    </>
  );
};

export default MyChallenges;
