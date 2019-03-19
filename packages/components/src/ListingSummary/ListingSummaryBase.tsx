import * as React from "react";

import { ListingSummaryComponentProps } from "./types";
import { StyledListingSummaryContainer } from "./styledComponents";

class ListingSummaryBase extends React.Component<ListingSummaryComponentProps> {
  public render(): JSX.Element {
    return (
      <StyledListingSummaryContainer>
        {this.props.listingDetailURL && <div onClick={this.redirect}>{this.props.children}</div>}
        {!this.props.listingDetailURL && <>{this.props.children}</>}
      </StyledListingSummaryContainer>
    );
  }
  private redirect = (ev: any): void => {
    this.props.history.push(this.props.listingDetailURL);
  };
}

export default ListingSummaryBase;
