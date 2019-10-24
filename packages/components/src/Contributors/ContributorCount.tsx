import * as React from "react";
import { ContributorCountStyled, ContributorsLabel, ContributorCountAvatars } from "./ContributorsStyledComponents";
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
        {this.props.displayedContributors.slice(0, 3).map((contributor: any, i: number) => {
          return (
            <ContributorCountAvatars>
              {contributor.payerChannel.tiny72AvatarDataUrl ? (
                <img key={i} src={contributor.payerChannel.tiny72AvatarDataUrl} />
              ) : (
                <ContributorsDefaultAvatar key={i} contributor={contributor[i]} index={i} size={17} />
              )}
            </ContributorCountAvatars>
          );
        })}
        <ContributorsLabel>
          {this.props.totalContributors}
          {this.props.totalContributors === 1 ? " Booster" : " Boosters"}
        </ContributorsLabel>
      </>
    );
  };
}
