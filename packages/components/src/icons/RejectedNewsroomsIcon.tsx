import * as React from "react";
import { colors } from "../styleConstants";

export interface RejectedNewsroomsProps {
  color?: string;
  height?: string;
  width?: string;
}

export const RejectedNewsroomsIcon: React.SFC<RejectedNewsroomsProps> = props => {
  const color = props.color || colors.primary.CIVIL_GRAY_2;
  const width = (props.width || 18).toString();
  const height = (props.height || 18).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 0C4.05 0 0 4.05 0 9s4.05 9 9 9 9-4.05 9-9-4.05-9-9-9zM1.8 9c0-3.96 3.24-7.2 7.2-7.2 1.62 0 3.15.54 4.41 1.53L3.33 13.41A7.093 7.093 0 0 1 1.8 9zM9 16.2c-1.62 0-3.15-.54-4.41-1.53L14.67 4.59A7.093 7.093 0 0 1 16.2 9c0 3.96-3.24 7.2-7.2 7.2z"
        fill={color}
      />
    </svg>
  );
};
