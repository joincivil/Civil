import * as React from "react";
import {
  ContributorsStyled,
  ContributorsTitle,
  ContributorsLabel,
  ContributorItem,
  ContributorAvatar,
  ContributorUserName,
  ContributorAmount,
} from "./ContributorsStyledComponents";
import { ContributorData } from "./types";
import { TipIcon } from "@joincivil/elements";

export interface LeaderboardProps {
  sortedContributors: ContributorData[];
}

export const Contributors: React.FunctionComponent<LeaderboardProps> = props => {
  return (
    <ContributorsStyled>
      <ContributorsTitle>Recent Boosters</ContributorsTitle>
      {props.sortedContributors ? (
        props.sortedContributors.slice(0, 3).map((contributor: any, i: number) => {
          return (
            <ContributorItem key={i}>
              <ContributorAvatar src={contributor.payerChannel.tiny72AvatarDataUrl} />
              <div>
                <ContributorUserName>{contributor.payerChannel.handle}</ContributorUserName>
                <ContributorAmount>{"$" + contributor.usdEquivalent}</ContributorAmount>
              </div>
            </ContributorItem>
          );
        })
      ) : (
        <ContributorsLabel>
          <TipIcon width={16} height={16} /> Be the first to Boost
        </ContributorsLabel>
      )}
    </ContributorsStyled>
  );
};
