import * as React from "react";
import { colors } from "../styleConstants";

export interface ApprovedNewsroomsProps {
  height?: string;
  width?: string;
}

export const ApprovedNewsroomsIcon: React.SFC<ApprovedNewsroomsProps> = props => {
  const color = colors.primary.CIVIL_GRAY_2;
  const width = props.width || "18";
  const height = props.height || "18";

  return (
    <svg width={width} height={height} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <circle fill="none" stroke={color} cx="9" cy="9" r="8.25" />
      <path fill={color} d="M12.6 5l-5.13 5.17L5.4 8.09 4 9.5 7.47 13 14 6.41z" />
    </svg>
  );
};
