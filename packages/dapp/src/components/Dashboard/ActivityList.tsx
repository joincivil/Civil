import * as React from "react";
import { Set } from "immutable";
import BigNumber from "bignumber.js";
import { ChallengeActivityListItem, ActivityListItem } from "./ActivityListItem";

export interface ActivityListOwnProps {
  listings?: Set<string>;
  challenges?: Set<string>;
  appealChallenges?: Set<string>;
  resolvedChallenges?: boolean;
  ActivityListItemComponent?: any;
  toggleChallengeSelect?(challengeID: string, isSelected: boolean, salt: BigNumber): void;
}

const ActivityList: React.FunctionComponent<ActivityListOwnProps> = props => {
  let index = 0;
  const ActivityListItemComponent = props.ActivityListItemComponent || ChallengeActivityListItem;
  return (
    <>
      {props.listings &&
        props.listings.map(l => {
          index++;
          return <ActivityListItem key={l} listingAddress={l!} even={index % 2 === 0} />;
        })}
      {!props.resolvedChallenges &&
        props.challenges &&
        props.challenges.map(c => {
          index++;
          return <ActivityListItemComponent key={c} challengeID={c!} even={index % 2 === 0} />;
        })}
      {!props.resolvedChallenges &&
        props.appealChallenges &&
        props.appealChallenges.map(c => {
          index++;
          return <ActivityListItemComponent key={c} challengeID={c!} even={index % 2 === 0} />;
        })}
    </>
  );
};

export default ActivityList;
