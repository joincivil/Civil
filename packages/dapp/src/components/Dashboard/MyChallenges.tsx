import * as React from "react";
import { Set } from "immutable";
import MyChallengesItem from "./MyChallengesItem";

export interface MyChallengesOwnProps {
  challenges?: Set<string>;
  appealChallenges?: Set<string>;
}

const MyChallenges: React.SFC<MyChallengesOwnProps> = props => {
  return (
    <>
      {props.challenges &&
        props.challenges.map(c => {
          return <MyChallengesItem key={c} challengeID={c!} />;
        })}
      {props.appealChallenges &&
        props.appealChallenges.map(c => {
          return <MyChallengesItem key={c} appealChallengeID={c!} />;
        })}
    </>
  );
};

export default MyChallenges;
