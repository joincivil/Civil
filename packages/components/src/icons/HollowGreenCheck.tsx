import * as React from "react";

export interface HollowGreenCheckProps {
  color?: string;
  height?: number;
  width?: number;
}

export const HollowGreenCheck: React.SFC<HollowGreenCheckProps> = props => {
  const color = props.color || "#29cb42";
  const width = (props.width || 20).toString();
  const height = (props.height || 20).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd" transform="translate(1 1)">
        <circle cx="9" cy="9" r="8.25" stroke={color} strokeWidth="1.5" />
        <path d="m12.6 5-5.13 5.17-2.07-2.08-1.4 1.41 3.47 3.5 6.53-6.59z" fill={color} fillRule="nonzero" />
      </g>
    </svg>
  );
};
