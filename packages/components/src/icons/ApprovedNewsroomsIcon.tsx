import * as React from "react";

export interface ApprovedNewsroomsProps {
  height?: string;
  width?: string;
}

export const ApprovedNewsroomsIcon: React.SFC<ApprovedNewsroomsProps> = props => {
  return (
    <svg width={props.width || "18"} height={props.height || "18"} xmlns="http://www.w3.org/2000/svg">
      <g fill="none">
        <circle stroke="#7D7373" cx="9" cy="9" r="8.25" />
        <path fill="#7D7373" d="M12.6 5l-5.13 5.17L5.4 8.09 4 9.5 7.47 13 14 6.41z" />
      </g>
    </svg>
  );
};
