import * as React from "react";
import { colors } from "../styleConstants";

export interface WarningIconProps {
  color?: string;
  fill?: string;
  height?: number;
  width?: number;
}

export const WarningIcon: React.FunctionComponent<WarningIconProps> = props => {
  const color = props.color || colors.accent.CIVIL_RED;
  const fill = props.fill || colors.accent.CIVIL_GRAY_6;
  const width = (props.width || 28).toString();
  const height = (props.height || 28).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" stroke-width="1" fill="none" fillRule="evenodd">
        <g transform="translate(-40.000000, -20.000000)">
          <g>
            <path
              d="M4,0.5 C2.06700338,0.5 0.5,2.06700338 0.5,4 L0.5,64 C0.5,65.9329966 2.06700338,67.5 4,67.5 L726,67.5 C727.932997,67.5 729.5,65.9329966 729.5,64 L729.5,4 C729.5,2.06700338 727.932997,0.5 726,0.5 L4,0.5 Z"
              stroke={color}
              fill={fill}
            />
            <g transform="translate(38.000000, 18.000000)">
              <polygon points="0 0 32 0 32 32 0 32" />
              <path
                d="M16,2.66666667 C8.64,2.66666667 2.66666667,8.64 2.66666667,16 C2.66666667,23.36 8.64,29.3333333 16,29.3333333 C23.36,29.3333333 29.3333333,23.36 29.3333333,16 C29.3333333,8.64 23.36,2.66666667 16,2.66666667 Z M17.3333333,22.6666667 L14.6666667,22.6666667 L14.6666667,20 L17.3333333,20 L17.3333333,22.6666667 Z M17.3333333,17.3333333 L14.6666667,17.3333333 L14.6666667,9.33333333 L17.3333333,9.33333333 L17.3333333,17.3333333 Z"
                fill={color}
                fillRule="nonzero"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
