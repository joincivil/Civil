import * as React from "react";
import { StyledSnackBar, StyledSnackBarContent } from "./styledComponents";

export const SnackBar: React.SFC = props => {
  return (
    <StyledSnackBar>
      <StyledSnackBarContent>{props.children}</StyledSnackBarContent>
    </StyledSnackBar>
  );
};
