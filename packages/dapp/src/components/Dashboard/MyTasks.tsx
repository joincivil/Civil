import * as React from "react";
import { Set } from "immutable";
import MyTasksItem from "./MyTasksItem";
import MyTasksProposalItem from "./MyTasksProposalItem";

export interface MyTasksOwnProps {
  challenges?: Set<string>;
  proposalChallenges?: Set<string>;
  showClaimRewardsTab(): void;
  showRescueTokensTab(): void;
}

const MyTasks: React.SFC<MyTasksOwnProps> = props => {
  return (
    <>
      {props.challenges &&
        props.challenges.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).map(c => {
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
      {props.proposalChallenges &&
        props.proposalChallenges.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).map(c => {
          return (
            <MyTasksProposalItem
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

export default MyTasks;
