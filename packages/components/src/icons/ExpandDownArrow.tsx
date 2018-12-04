import * as React from "react";

export interface ExpandDownArrowProps {
  color?: string;
  height?: number;
  opacity?: number;
  width?: number;
}

export const ExpandDownArrow: React.SFC<ExpandDownArrowProps> = props => {
  const { color, height, opacity, width } = props;
  const heightStr = height ? height.toString() : "8";
  const opacityStr = opacity ? opacity.toString() : "0.86";
  const widthStr = width ? width.toString() : "12";

  return (
    <svg width={widthStr} height={heightStr} xmlns="http://www.w3.org/2000/svg">
      <path fill={color} fillRule="evenodd" opacity={opacityStr} d="M10.824.412L6 5.457 1.068.412 0 1.4l6 6 6-6z" />
    </svg>
  );
};
