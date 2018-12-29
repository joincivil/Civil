import * as React from "react";
import { StyledTokenHeaderOuter, StyledTokenHeader } from "./TokenStyledComponents";

export const UserAccountHeader: React.StatelessComponent = props => {
  return (
    <StyledTokenHeaderOuter>
      <StyledTokenHeader>{props.children}</StyledTokenHeader>
    </StyledTokenHeaderOuter>
  );
};
