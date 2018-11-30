import * as React from "react";
import { colors } from "../styleConstants";

export interface CloseXIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const CloseXIcon: React.SFC<CloseXIconProps> = props => {
  const color = props.color || colors.basic.WHITE;
  const width = (props.width || 42).toString();
  const height = (props.height || 42).toString();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path
        fill={color}
        fillRule="evenodd"
        d="M20.571 18.657l6.01-6.01 1.415 1.414-6.01 6.01 6.01 6.01-1.415 1.415-6.01-6.01-6.01 6.01-1.415-1.415 6.01-6.01-6.01-6.01 1.415-1.415 6.01 6.01z"
      />
    </svg>
  );
};
