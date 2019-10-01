import * as React from "react";
import { ContributerCountStyled, ContributerCountTotal, ContributerCountAvatars } from "./LeaderboardStyledComponents";
import { Contributers } from "./types";

export interface ContributersCountProps {
  contributers: Contributers[];
  totalContributers: number;
}

export const ContributerCount: React.FunctionComponent<ContributersCountProps> = props => {
  return (
    <ContributerCountStyled>
      <ContributerCountAvatars>
        {props.contributers.map((contributer, idx) => (
          <img src={contributer.avatar} key={idx} />
        ))}
      </ContributerCountAvatars>
      <ContributerCountTotal>{props.totalContributers + " contributors"}</ContributerCountTotal>
    </ContributerCountStyled>
  );
};
