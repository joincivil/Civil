import * as React from "react";
import { colors } from "../colors";

export interface TrustMarkIconProps {
  height?: number;
  width?: number;
}

export const TrustMarkIcon: React.FunctionComponent<TrustMarkIconProps> = props => {
  const width = (props.width || 40).toString();
  const height = (props.height || 40).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-282, -18)" fill={colors.accent.CIVIL_TEAL_DARK}>
          <path d="M308.909553,20 L312.325,27.674 L320,31.0904474 L316.923,38 L320,44.9095526 L312.325,48.326 L308.909553,56 L302,52.923 L295.090447,56 L291.673,48.325 L284,44.9095526 L287.076,38 L284,31.0904474 L291.674,27.674 L295.090447,20 L302,23.076 L308.909553,20 Z M309.187143,31 L299.428571,40.4692898 L294.812857,36.0028791 L293,37.7619962 L299.428571,44 L311,32.7715931 L309.187143,31 Z"></path>
        </g>
      </g>
    </svg>
  );
};
