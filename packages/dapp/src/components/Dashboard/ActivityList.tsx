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
  toggleChallengeSelect?(challengeID: string, isSelected: boolean, salt: BigNumber): void;
}

class ActivityList extends React.Component<ActivityListOwnProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    let index = 0;
    return (
      <>
        {this.props.listings &&
          this.props.listings.map(l => {
            index++;
            return <ActivityListItem key={l} listingAddress={l!} even={index % 2 === 0} />;
          })}
        {!!this.props.resolvedChallenges &&
          this.props.challenges &&
          this.props.challenges.map(c => {
            index++;
            return (
              <ResolvedChallengeActivityListItem
                toggleSelect={this.props.toggleChallengeSelect!}
                key={c}
                challengeID={c!}
                even={index % 2 === 0}
              />
            );
          })}
        {!!this.props.resolvedChallenges &&
          this.props.appealChallenges &&
          this.props.appealChallenges.map(c => {
            index++;
            return (
              <ResolvedAppealChallengeActivityListItem
                toggleSelect={this.props.toggleChallengeSelect!}
                key={c}
                challengeID={c!}
                even={index % 2 === 0}
              />
            );
          })}
        {!this.props.resolvedChallenges &&
          this.props.challenges &&
          this.props.challenges.map(c => {
            index++;
            return <ChallengeActivityListItem key={c} challengeID={c!} even={index % 2 === 0} />;
          })}
        {!this.props.resolvedChallenges &&
          this.props.appealChallenges &&
          this.props.appealChallenges.map(c => {
            index++;
            return (
              <ResolvedAppealChallengeActivityListItem
                toggleSelect={this.props.toggleChallengeSelect!}
                key={c}
                challengeID={c!}
                even={index % 2 === 0}
              />
            );
          })}
      </>
    );
  }
}

export default ActivityList;
