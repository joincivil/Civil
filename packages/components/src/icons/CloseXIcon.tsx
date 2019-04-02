import * as React from "react";
import { colors } from "../styleConstants";

export interface CloseXIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const CloseXIcon: React.FunctionComponent<CloseXIconProps> = props => {
  const color = props.color || colors.basic.WHITE;
  const width = (props.width || 42).toString();
  const height = (props.height || 42).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        fillRule="evenodd"
        d="M20.571 18.657l6.01-6.01 1.415 1.414-6.01 6.01 6.01 6.01-1.415 1.415-6.01-6.01-6.01 6.01-1.415-1.415 6.01-6.01-6.01-6.01 1.415-1.415 6.01 6.01z"
      />
    </svg>
  );
};
