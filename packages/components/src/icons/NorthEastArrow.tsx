import * as React from "react";

export interface NorthEastArrowProps {
  color?: string;
  height?: number;
  width?: number;
}

export const NorthEastArrow: React.SFC<NorthEastArrowProps> = props => {
  const color = props.color || "#23282d";
  const width = (props.width || 11).toString();
  const height = (props.height || 11).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m10.098 7.998h-1.279v-4.823l-6.914 6.923-.905-.905 6.923-6.915h-4.823v-1.278h6.998z"
        fillRule="evenodd"
        fill={color}
      />
    </svg>
  );
};
