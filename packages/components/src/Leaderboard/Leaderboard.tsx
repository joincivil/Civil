import * as React from "react";
import {
  LeaderboardLabel,
  LeaderboardUser,
  LeaderboardAvatar,
  LeaderboardUserName,
  LeaderboardAmount,
} from "./LeaderboardStyledComponents";

export interface Contributers {
  avatar: string;
  username: string;
  amount: string;
}

export interface LeaderboardProps {
  label?: string;
  contributers: Contributers[];
}

export const Leaderboard: React.FunctionComponent<LeaderboardProps> = props => {
  return (
    <>
      {props.label && <LeaderboardLabel>{props.label}</LeaderboardLabel>}
      {props.contributers.map((contributer, idx) => (
        <LeaderboardUser key={idx}>
          <LeaderboardAvatar src={contributer.avatar} />
          <div>
            <LeaderboardUserName>{contributer.username}</LeaderboardUserName>
            <LeaderboardAmount>{contributer.amount}</LeaderboardAmount>
          </div>
        </LeaderboardUser>
      ))}
    </>
  );
};
