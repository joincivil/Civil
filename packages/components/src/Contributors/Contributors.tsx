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
      {props.sortedContributors.slice(0, 3).map((contributor: any, i: number) => {
        return (
          <ContributorItem key={i}>
            <ContributorAvatar src={contributor.payerChannel.tiny72AvatarDataUrl} />
            <div>
              <ContributorUserName>{contributor.payerChannel.handle}</ContributorUserName>
              <ContributorAmount>{"$" + contributor.usdEquivalent}</ContributorAmount>
            </div>
          </ContributorItem>
        );
      })}
    </ContributorsStyled>
  );
};
