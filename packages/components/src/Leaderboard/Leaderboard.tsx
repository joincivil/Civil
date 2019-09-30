import * as React from "react";
import {
  LeaderboardLabel,
  LeaderboardItem,
  LeaderboardAvatar,
  LeaderboardUserName,
  LeaderboardAmount,
} from "./LeaderboardStyledComponents";
import { Contributers } from "./types";

export interface LeaderboardProps {
  label?: string;
  contributers: Contributers[];
}

export const Leaderboard: React.FunctionComponent<LeaderboardProps> = props => {
  return (
    <>
      {props.label && <LeaderboardLabel>{props.label}</LeaderboardLabel>}
      {props.contributers.map((contributer, idx) => (
        <LeaderboardItem key={idx}>
          <LeaderboardAvatar src={contributer.avatar} />
          <div>
            <LeaderboardUserName>{contributer.username}</LeaderboardUserName>
            <LeaderboardAmount>{contributer.amount}</LeaderboardAmount>
          </div>
        </LeaderboardItem>
      ))}
    </>
  );
};
