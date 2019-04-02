import * as React from "react";
import { colors } from "../styleConstants";

export interface DisclosureArrowIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const DisclosureArrowIcon: React.FunctionComponent<DisclosureArrowIconProps> = props => {
  const color = props.color || colors.accent.CIVIL_BLUE;
  const width = (props.width || 8).toString();
  const height = (props.height || 12).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 8 12" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill={color} fillRule="evenodd">
        <g transform="translate(-693, -56)">
          <polygon points="694.4 56 693 57.4 697.6 62 693 66.6 694.4 68 700.4 62" />
        </g>
      </g>
    </svg>
  );
};
