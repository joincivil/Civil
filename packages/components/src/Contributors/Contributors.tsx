import * as React from "react";
import {
  ContributorsStyled,
  ContributorsLabel,
  ContributorItem,
  ContributorAvatar,
  ContributorUserName,
  ContributorAmount,
} from "./ContributorsStyledComponents";
import { ContributorData } from "./types";

export interface LeaderboardProps {
  label?: string;
  sortedContributors: ContributorData[];
}

export const Contributors: React.FunctionComponent<LeaderboardProps> = props => {
  return (
    <ContributorsStyled>
      {props.label && <ContributorsLabel>{props.label}</ContributorsLabel>}
      {props.sortedContributors.map((contributor, idx) => (
        <ContributorItem key={idx}>
          <ContributorAvatar src={contributor.avatar} />
          <div>
            <ContributorUserName>{contributor.username}</ContributorUserName>
            <ContributorAmount>{contributor.amount}</ContributorAmount>
          </div>
        </ContributorItem>
      ))}
    </ContributorsStyled>
  );
};
