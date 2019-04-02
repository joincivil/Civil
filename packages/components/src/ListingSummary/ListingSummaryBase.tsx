import * as React from "react";
import { Link } from "react-router-dom";

import { ListingSummaryComponentProps } from "./types";
import { StyledListingSummaryContainer } from "./styledComponents";

const ListingSummaryBase: React.FunctionComponent<ListingSummaryComponentProps> = props => {
  return (
    <StyledListingSummaryContainer>
      {props.listingDetailURL && <Link to={props.listingDetailURL}>{props.children}</Link>}
      {!props.listingDetailURL && <>{props.children}</>}
    </StyledListingSummaryContainer>
  );
};

export default ListingSummaryBase;
