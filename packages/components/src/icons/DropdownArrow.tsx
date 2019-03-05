import * as React from "react";
import { colors } from "../styleConstants";

export const DropdownArrow: React.SFC = props => {
  const color = colors.accent.CIVIL_GRAY_0;

  return (
    <svg height="5" width="10" viewBox="0 0 10 5" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 10,0 5,5" fill={color} stroke="none" />
    </svg>
  );
};
