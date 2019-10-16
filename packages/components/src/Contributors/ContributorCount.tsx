import * as React from "react";
import { ContributorCountStyled, ContributorsLabel, ContributorCountAvatars } from "./ContributorsStyledComponents";
import { ContributorData } from "./types";

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
            return <img src={contributor.payerChannel.tiny72AvatarDataUrl} key={i} />;
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
