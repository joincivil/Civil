import * as React from "react";
import { colors } from "../styleConstants";

export interface GreenCheckMarkProps {
  height?: number;
  width?: number;
}

export const GreenCheckMark: React.SFC<GreenCheckMarkProps> = props => {
  const width = (props.width || 26).toString();
  const height = (props.height || 26).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
      <circle fill={colors.accent.CIVIL_TEAL} cx="12" cy="12" r="12" />
      <g fill="none" fillRule="evenodd" transform="translate(1 1)">
        <g fill={colors.basic.WHITE}>
          <path
            fill={colors.basic.WHITE}
            d="m9.464 17.092-3.466-3.415-1.156 1.138 4.622 4.553 9.904-9.756-1.155-1.138z"
            transform="translate(0 -2)"
          />
        </g>
      </g>
    </svg>
  );
};
