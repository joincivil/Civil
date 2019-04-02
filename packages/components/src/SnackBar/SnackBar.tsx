import * as React from "react";
import { StyledSnackBar, StyledSnackBarContent } from "./styledComponents";

export const SnackBar: React.FunctionComponent = props => {
  return (
    <StyledSnackBar>
      <StyledSnackBarContent>{props.children}</StyledSnackBarContent>
    </StyledSnackBar>
  );
};
