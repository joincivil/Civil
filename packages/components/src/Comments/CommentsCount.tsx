import * as React from "react";
import { CommentsCountStyled, CommentsLabel } from "./CommentsStyledComponents";

export interface CommentsCountProps {
  numComments: number;
}

export class CommentsCount extends React.Component<CommentsCountProps> {
  public render(): JSX.Element {
    return (
      <CommentsCountStyled>
        {this.props.numComments !== 0 ? (
          this.renderContributers()
        ) : (
          <CommentsLabel>Be the first to Comment</CommentsLabel>
        )}
      </CommentsCountStyled>
    );
  }
  private renderContributers = (): JSX.Element => {
    return (
      <>
        <CommentsLabel>
          {this.props.numComments}
          {this.props.numComments === 1 ? " Comment" : " Comments"}
        </CommentsLabel>
      </>
    );
  };
}
