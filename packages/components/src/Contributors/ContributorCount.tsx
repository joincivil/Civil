import * as React from "react";
import { ContributorCountStyled, ContributorCountTotal, ContributorCountAvatars } from "./ContributorsStyledComponents";
import { ContributorData } from "./types";

export interface ContributorsCountProps {
  displayedContributors: ContributorData[];
  totalContributors: number;
}

export const ContributorCount: React.FunctionComponent<ContributorsCountProps> = props => {
  return (
    <ContributorCountStyled>
      <ContributorCountAvatars>
        {props.displayedContributors.map((contributor, idx) => (
          <img src={contributor.avatar} key={idx} />
        ))}
      </ContributorCountAvatars>
      <ContributorCountTotal>{props.totalContributors + " contributors"}</ContributorCountTotal>
    </ContributorCountStyled>
  );
};
