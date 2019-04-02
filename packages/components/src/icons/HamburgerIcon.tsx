import * as React from "react";
import { colors } from "../styleConstants";

export interface HamburgerIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const HamburgerIcon: React.FunctionComponent<HamburgerIconProps> = props => {
  const color = props.color || colors.basic.WHITE;
  const width = (props.width || 42).toString();
  const height = (props.height || 42).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
      <path fill={color} fillRule="evenodd" d="M12 26h18v-2H12v2zm0-8h18v-2H12v2z" />
    </svg>
  );
};
