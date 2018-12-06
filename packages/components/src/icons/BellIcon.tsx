import * as React from "react";

import { colors } from "../styleConstants";

export interface BellIconProps {
  height?: number;
  width?: number;
  color?: string;
}

export const BellIcon: React.SFC<BellIconProps> = props => {
  const width = (props.width || 21).toString();
  const height = (props.height || 24).toString();

  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      viewBox={`0 0 ${width} ${height}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-869.000000, -1137.000000)" fill={props.color || colors.primary.BLACK}>
          <g transform="translate(829.000000, 1096.000000)">
            <g transform="translate(40.000000, 41.000000)">
              <path
                d="M10.0645161,24 C11.3419355,24 12.3870968,22.9548387 12.3870968,21.6774194 L7.74193548,21.6774194 C7.74193548,22.9548387 8.78709677,24 10.0645161,24 L10.0645161,24 Z M17.7609108,16.5768501 L17.7609108,10.0645161 C17.7609108,6.39392789 15.2743833,3.43377609 11.8406072,2.60493359 L11.8406072,1.77609108 C11.8406072,0.828842505 11.0117647,0 10.0645161,0 C9.11726755,0 8.28842505,0.828842505 8.28842505,1.77609108 L8.28842505,2.60493359 C4.85464896,3.43377609 2.36812144,6.39392789 2.36812144,10.0645161 L2.36812144,16.5768501 L0,18.9449715 L0,20.1290323 L20.1290323,20.1290323 L20.1290323,18.9449715 L17.7609108,16.5768501 L17.7609108,16.5768501 Z"
                id="Shape"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
