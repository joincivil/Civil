import * as React from "react";
import { StyledTokenHeaderOuter, StyledTokenHeader } from "./TokensStyledComponents";

export const UserTokenAccountHeader: React.StatelessComponent = props => {
  return (
    <StyledTokenHeaderOuter>
      <StyledTokenHeader>{props.children}</StyledTokenHeader>
    </StyledTokenHeaderOuter>
  );
};
