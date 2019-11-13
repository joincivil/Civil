import * as React from "react";
import { Map, Set } from "immutable";
import MyTasksItem from "./MyTasksItem";
import MyTasksProposalItem from "./MyTasksProposalItem";
import MyChallengesItem from "./MyChallengeItem/MyChallengesItem";

export interface MyTasksListOwnProps {
  challenges?: Set<string>;
  fullChallenges?: Set<any>;
  proposalChallenges?: Set<string>;
  userChallengeData?: Map<string, any>;
  challengeToAppealChallengeMap?: Map<string, string>;
  refetchUserChallengeData?(): void;
  showClaimRewardsTab(): void;
  showRescueTokensTab(): void;
}

const MyTasksList: React.FunctionComponent<MyTasksListOwnProps> = props => {
  const { userChallengeData: allUserChallengeData, challengeToAppealChallengeMap, refetchUserChallengeData } = props;
  return (
    <>
      {props.fullChallenges &&
        props.fullChallenges
          .sort((a, b) => parseInt(a.challengeID, 10) - parseInt(b.challengeID, 10))
          .map(c => {
            let userChallengeData;
            let appealChallengeUserData;
            if (allUserChallengeData) {
              userChallengeData = allUserChallengeData.get(c!.challengeID);

              if (challengeToAppealChallengeMap) {
                const childAppealChallengeID = challengeToAppealChallengeMap.get(c!.challengeID);
                if (childAppealChallengeID) {
                  appealChallengeUserData = allUserChallengeData.get(childAppealChallengeID);
                }
              }
            }
            return (
              <MyChallengesItem
                key={c!.challengeID}
                challenge={c!}
                queryUserChallengeData={userChallengeData}
                queryUserAppealChallengeData={appealChallengeUserData}
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
      {props.challenges &&
        props.challenges
          .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
          .map(c => {
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
        props.proposalChallenges
          .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
          .map(c => {
            let userChallengeData;
            if (allUserChallengeData) {
              userChallengeData = allUserChallengeData.get(c!);
            }
            return (
              <MyTasksProposalItem
                key={c}
                challengeID={c!}
                queryUserChallengeData={userChallengeData}
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
