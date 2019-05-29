import * as React from "react";
import { Map, Set } from "immutable";
import MyTasksItem from "./MyTasksItem";
import MyTasksProposalItem from "./MyTasksProposalItem";

export interface MyTasksListOwnProps {
  challenges?: Set<string>;
  proposalChallenges?: Set<string>;
  userChallengeData?: Map<string, any>;
  challengeToAppealChallengeMap?: Map<string, string>;
  useGraphQL?: boolean;
  refetchUserChallengeData?(): void;
  showClaimRewardsTab(): void;
  showRescueTokensTab(): void;
}

const MyTasksList: React.FunctionComponent<MyTasksListOwnProps> = props => {
  const {
    userChallengeData: allUserChallengeData,
    challengeToAppealChallengeMap,
    useGraphQL,
    refetchUserChallengeData,
  } = props;
  return (
    <>
      {props.challenges &&
        props.challenges.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).map(c => {
          let userChallengeData;
          let appealChallengeUserData;
          if (allUserChallengeData) {
            userChallengeData = allUserChallengeData.get(c!);

            if (challengeToAppealChallengeMap) {
              const childAppealChallengeID = challengeToAppealChallengeMap.get(c!);
              if (childAppealChallengeID) {
                appealChallengeUserData = allUserChallengeData.get(childAppealChallengeID);
              }
            }
          }
          return (
            <MyTasksItem
              key={c}
              challengeID={c!}
              queryUserChallengeData={userChallengeData}
              queryUserAppealChallengeData={appealChallengeUserData}
              useGraphQL={useGraphQL}
              refetchUserChallengeData={refetchUserChallengeData}
              showClaimRewardsTab={() => {
                props.showClaimRewardsTab();
              }}
              showRescueTokensTab={() => {
                props.showRescueTokensTab();
              }}
            />
          );
        })}
      {props.proposalChallenges &&
        props.proposalChallenges.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).map(c => {
          let userChallengeData;
          if (allUserChallengeData) {
            userChallengeData = allUserChallengeData.get(c!);
          }
          return (
            <MyTasksProposalItem
              key={c}
              challengeID={c!}
              queryUserChallengeData={userChallengeData}
              useGraphQL={useGraphQL}
              refetchUserChallengeData={refetchUserChallengeData}
              showClaimRewardsTab={() => {
                props.showClaimRewardsTab();
              }}
              showRescueTokensTab={() => {
                props.showRescueTokensTab();
              }}
            />
          );
        })}
    </>
  );
};

export default MyTasksList;
