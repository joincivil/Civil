import * as React from "react";
import {
  ContributorCountStyled,
  ContributorsLabel,
  ContributorCountAvatars,
  ContributorCountAvatar,
} from "./ContributorsStyledComponents";
import { ContributorData } from "./types";
import { ContributorsDefaultAvatar } from "./ContributorsDefaultAvatar";

export interface ContributorsCountProps {
  displayedContributors: ContributorData[];
  totalContributors: number;
}

export class ContributorCount extends React.Component<ContributorsCountProps> {
  public render(): JSX.Element {
    return (
      <ContributorCountStyled>
        {this.props.totalContributors !== 0 ? (
          this.renderContributers()
        ) : (
          <ContributorsLabel>Be the first to Boost</ContributorsLabel>
        )}
      </ContributorCountStyled>
    );
  }
  private renderContributers = (): JSX.Element => {
    return (
      <>
        <ContributorCountAvatars>
          {this.props.displayedContributors.slice(0, 3).map((contributor: any, i: number) => {
            return (
              <ContributorCountAvatar key={i}>
                {contributor.payerChannel && contributor.payerChannel.tiny72AvatarDataUrl ? (
                  <img src={contributor.payerChannel.tiny72AvatarDataUrl} />
                ) : (
                  <ContributorsDefaultAvatar contributor={contributor[i]} index={i} size={15} />
                )}
              </ContributorCountAvatar>
            );
          })}
        </ContributorCountAvatars>
        <ContributorsLabel>
          {this.props.totalContributors}
          {this.props.totalContributors === 1 ? " Booster" : " Boosters"}
        </ContributorsLabel>
      </>
    );
  };
}
