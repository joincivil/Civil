import * as React from "react";
import { Set } from "immutable";
import MyTasksItem from "./MyTasksItem";

export interface MyChallengesOwnProps {
  challenges?: Set<string>;
  showClaimRewardsTab(): void;
  showRescueTokensTab(): void;
}

const MyChallenges: React.SFC<MyChallengesOwnProps> = props => {
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
    </>
  );
};

export default MyChallenges;
