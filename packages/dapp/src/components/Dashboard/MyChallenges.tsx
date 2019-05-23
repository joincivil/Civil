import * as React from "react";
import { Map, Set } from "immutable";
import {
  Tabs,
  Tab,
  ChallengesStakedDashboardTabTitle,
  ChallengesCompletedDashboardTabTitle,
  StyledDashboardSubTab,
  StyledDashboardActivityDescription,
} from "@joincivil/components";
import { StyledTabsComponent } from "./DashboardActivity";
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
    activeSubTabIndex,
    setActiveSubTabIndex,
    showClaimRewardsTab,
    showRescueTokensTab,
  } = props;

  const completedChallengesTitle = (
    <ChallengesCompletedDashboardTabTitle count={allCompletedChallengesVotedOn.count()} />
  );
  const stakedChallengesTitle = <ChallengesStakedDashboardTabTitle count={currentUserChallengesStarted.count()} />;

  return (
    <>
      <Tabs
        TabComponent={StyledDashboardSubTab}
        TabsNavComponent={StyledTabsComponent}
        activeIndex={activeSubTabIndex}
        onActiveTabChange={setActiveSubTabIndex}
      >
        <Tab title={completedChallengesTitle}>
          <>
            <StyledDashboardActivityDescription>
              Summary of completed challenges you voted in
            </StyledDashboardActivityDescription>
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
        </Tab>
        <Tab title={stakedChallengesTitle}>
          <>
            <StyledDashboardActivityDescription>Challenges you created</StyledDashboardActivityDescription>
            <MyTasksList
              challenges={currentUserChallengesStarted}
              showClaimRewardsTab={showClaimRewardsTab}
              showRescueTokensTab={showRescueTokensTab}
            />
          </>
        </Tab>
      </Tabs>
    </>
  );
};

export default MyChallenges;
