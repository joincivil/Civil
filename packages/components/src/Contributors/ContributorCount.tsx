import * as React from "react";
import { ContributorCountStyled, ContributorCountTotal, ContributorCountAvatars } from "./ContributorsStyledComponents";
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
          <ContributorCountTotal>Be the first to tip</ContributorCountTotal>
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
        <ContributorCountTotal>
          {this.props.totalContributors}
          {this.props.totalContributors === 1 ? " contributor" : " contributors"}
        </ContributorCountTotal>
      </>
    );
  };
}
