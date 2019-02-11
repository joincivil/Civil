import * as React from "react";
import { Set } from "immutable";
import BigNumber from "bignumber.js";
import { ChallengeActivityListItem, ActivityListItem, ResolvedChallengeActivityListItem } from "./ActivityListItem";
import {
  ResolvedAppealChallengeActivityListItem,
  // AppealChallengeActivityListItem,
} from "./ActivityListAppealChallengeItem";

export interface ActivityListOwnProps {
  listings?: Set<string>;
  challenges?: Set<string>;
  appealChallenges?: Set<string>;
  resolvedChallenges?: boolean;
  ActivityListItemComponent?: any;
  toggleChallengeSelect?(challengeID: string, isSelected: boolean, salt: BigNumber): void;
}

const ActivityList: React.SFC<ActivityListOwnProps> = props => {
  let index = 0;
  const ActivityListItemComponent = props.ActivityListItemComponent || ChallengeActivityListItem;
  return (
    <>
      {props.listings &&
        props.listings.map(l => {
          index++;
          return <ActivityListItem key={l} listingAddress={l!} even={index % 2 === 0} />;
        })}
      {!!props.resolvedChallenges &&
        props.challenges &&
        props.challenges.map(c => {
          index++;
          return (
            <ResolvedChallengeActivityListItem
              toggleSelect={props.toggleChallengeSelect!}
              key={c}
              challengeID={c!}
              even={index % 2 === 0}
            />
          );
        })}
      {!!props.resolvedChallenges &&
        props.appealChallenges &&
        props.appealChallenges.map(c => {
          index++;
          return (
            <ResolvedAppealChallengeActivityListItem
              toggleSelect={props.toggleChallengeSelect!}
              key={c}
              challengeID={c!}
              even={index % 2 === 0}
            />
          );
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
          return (
            <ResolvedAppealChallengeActivityListItem
              toggleSelect={props.toggleChallengeSelect!}
              key={c}
              challengeID={c!}
              even={index % 2 === 0}
            />
          );
        })}
    </>
  );
};

export default ActivityList;
