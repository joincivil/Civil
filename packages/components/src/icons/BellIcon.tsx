import * as React from "react";
import { colors } from "../styleConstants";

export interface BellIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const BellIcon: React.SFC<BellIconProps> = props => {
  const color = props.color || colors.primary.BLACK;
  const width = (props.width || 21).toString();
  const height = (props.height || 24).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 21 24" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill={color} fillRule="evenodd">
        <path d="M10.065 24C11.342 24 12.387 22.955 12.387 21.677L7.742 21.677C7.742 22.955 8.787 24 10.065 24L10.065 24ZM17.761 16.577L17.761 10.065C17.761 6.394 15.274 3.434 11.841 2.605L11.841 1.776C11.841 0.829 11.012 0 10.065 0 9.117 0 8.288 0.829 8.288 1.776L8.288 2.605C4.855 3.434 2.368 6.394 2.368 10.065L2.368 16.577 0 18.945 0 20.129 20.129 20.129 20.129 18.945 17.761 16.577 17.761 16.577Z" />
      </g>
    </svg>
  );
};
