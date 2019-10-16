import * as React from "react";
import {
  ContributorsStyled,
  ContributorsTitle,
  ContributorsLabel,
  ContributorsPrompt,
  ContributorItem,
  ContributorAvatar,
  ContributorUserName,
  ContributorAmount,
  ContributorsIconBorder,
} from "./ContributorsStyledComponents";
import { ContributorData } from "./types";
import { TipIcon } from "@joincivil/elements";
import { ContributorsDefaultAvatar } from "./ContributorsDefaultAvatar";

export interface ContributorsProps {
  sortedContributors: ContributorData[];
}

export const Contributors: React.FunctionComponent<ContributorsProps> = props => {
  return (
    <ContributorsStyled>
      <ContributorsTitle>Recent Boosters</ContributorsTitle>
      {props.sortedContributors ? (
        props.sortedContributors.slice(0, 3).map((contributor: any, i: number) => {
          return (
            <ContributorItem key={i}>
              {contributor.payerChannel.tiny72AvatarDataUrl ? (
                <ContributorAvatar src={contributor.payerChannel.tiny72AvatarDataUrl} />
              ) : (
                <ContributorsDefaultAvatar contributor={contributor[i]} index={i} size={32} />
              )}
              <div>
                <ContributorUserName>{contributor.payerChannel.handle}</ContributorUserName>
                <ContributorAmount>{"$" + contributor.usdEquivalent}</ContributorAmount>
              </div>
            </ContributorItem>
          );
        })
      ) : (
        <ContributorsPrompt>
          <ContributorsIconBorder>
            <TipIcon width={18} height={18} />
          </ContributorsIconBorder>
          <ContributorsLabel>Be the first to Boost</ContributorsLabel>
        </ContributorsPrompt>
      )}
    </ContributorsStyled>
  );
};
