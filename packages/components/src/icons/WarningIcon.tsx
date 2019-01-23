import * as React from "react";
import { colors } from "../styleConstants";

export interface WarningIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const WarningIcon: React.SFC<WarningIconProps> = props => {
  const color = props.color || colors.accent.CIVIL_RED;
  const width = (props.width || 28).toString();
  const height = (props.height || 24).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 28 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 24L27.294 24 13.647 0 0 24 0 24ZM14.888 20.211L12.406 20.211 12.406 17.684 14.888 17.684 14.888 20.211 14.888 20.211ZM14.888 15.158L12.406 15.158 12.406 10.105 14.888 10.105 14.888 15.158 14.888 15.158Z"
        fill={color}
        fillRule="evenodd"
      />
    </svg>
  );
};
