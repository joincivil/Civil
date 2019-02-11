import * as React from "react";
import { Set } from "immutable";
import MyTasksItem from "./MyTasksItem";

export interface MyTasksOwnProps {
  challenges?: Set<string>;
  appealChallenges?: Set<string>;
  showClaimRewardsTab(): void;
  showRescueTokensTab(): void;
}

const MyTasks: React.SFC<MyTasksOwnProps> = props => {
  return (
    <>
      {props.challenges &&
        props.challenges.map(c => {
          return (
            <MyTasksItem
              key={c}
              challengeID={c!}
              showClaimRewardsTab={() => {
                props.showClaimRewardsTab();
              }}
              showRescueTokensTab={() => {
                props.showRescueTokensTab();
              }}
            />
          );
        })}
      {props.appealChallenges &&
        props.appealChallenges.map(c => {
          return (
            <MyTasksItem
              key={c}
              appealChallengeID={c!}
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

export default MyTasks;
