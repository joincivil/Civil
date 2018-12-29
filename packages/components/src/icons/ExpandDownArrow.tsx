import * as React from "react";
import { colors } from "../styleConstants";

export interface ExpandDownArrowProps {
  color?: string;
  width?: number;
  height?: number;
  opacity?: number;
}

export const ExpandDownArrow: React.SFC<ExpandDownArrowProps> = props => {
  const color = props.color || colors.basic.WHITE;
  const width = (props.width || 8).toString();
  const height = (props.height || 12).toString();
  const opacity = (props.opacity || 0.86).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg">
      <path fill={color} fillRule="evenodd" opacity={opacity} d="M10.824.412L6 5.457 1.068.412 0 1.4l6 6 6-6z" />
    </svg>
  );
};
