import * as React from "react";
import { colors } from "../styleConstants";

export interface WarningIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const WarningIcon: React.SFC<WarningIconProps> = props => {
  const width = (props.width || 28).toString();
  const height = (props.height || 24).toString();
  const color = props.color || colors.accent.CIVIL_RED;
  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-358.000000, -112.000000)" fill={color}>
          <g transform="translate(0.000000, 68.000000)">
            <g transform="translate(358.000000, 44.000000)">
              <g>
                <path d="M0,24 L27.2941236,24 L13.6470618,0 L0,24 L0,24 Z M14.8877038,20.2105263 L12.4064198,20.2105263 L12.4064198,17.6842105 L14.8877038,17.6842105 L14.8877038,20.2105263 L14.8877038,20.2105263 Z M14.8877038,15.1578947 L12.4064198,15.1578947 L12.4064198,10.1052632 L14.8877038,10.1052632 L14.8877038,15.1578947 L14.8877038,15.1578947 Z" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
