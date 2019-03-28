import * as React from "react";
import { ListingSummaryComponentProps } from "./types";
import { StyledListingSummaryContainer } from "./styledComponents";

export interface ListingSummaryBaseHistoryProp {
  history?: any;
}
class ListingSummaryBase extends React.Component<ListingSummaryComponentProps & ListingSummaryBaseHistoryProp> {
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
