import * as React from "react";
import { ContributerCountTotal, ContributerCountAvatar } from "./LeaderboardStyledComponents";
import { Contributers } from "./types";

export interface ContributersCountProps {
  label?: string;
  contributers: Contributers[];
  total: number;
}

export const ContributerCount: React.FunctionComponent<ContributersCountProps> = props => {
  return (
    <>
      {props.contributers.map((contributer, idx) => (
        <ContributerCountAvatar src={contributer.avatar} key={idx} />
      ))}
      <ContributerCountTotal>{props.total + " " + props.label || "contributors"}</ContributerCountTotal>
    </>
  );
};
