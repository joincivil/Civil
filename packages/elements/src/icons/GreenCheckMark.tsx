import * as React from "react";
import { colors } from "../colors";

export interface GreenCheckMark {
  height?: number;
  width?: number;
}

export const GreenCheckMark: React.FunctionComponent<GreenCheckMark> = props => {
  const height = (props.height || 26).toString();
  const width = (props.width || 26).toString();
  return (
    <svg width={width} height={height} viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
      <circle fill={colors.accent.CIVIL_TEAL} cx="12" cy="12" r="12" />
      <path
        d="m9.464 17.092-3.466-3.415-1.156 1.138 4.622 4.553 9.904-9.756-1.155-1.138z"
        transform="translate(1 -1)"
        fill={colors.basic.WHITE}
        fillRule="evenodd"
      />
    </svg>
  );
};
