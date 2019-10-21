import * as React from "react";

export interface ChallengeMarkIconProps {
  height?: number;
  width?: number;
}

export const ChallengeMarkIcon: React.FunctionComponent<ChallengeMarkIconProps> = props => {
  const width = (props.width || 40).toString();
  const height = (props.height || 40).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-282, -18)" fill="#FCB036">
          <path d="M308.909553,20 L312.325,27.674 L320,31.0904474 L316.923,38 L320,44.9095526 L312.325,48.325 L308.909553,56 L302,52.923 L295.090447,56 L291.674,48.325 L284,44.9095526 L287.076,38 L284,31.0904474 L291.674,27.674 L295.090447,20 L302,23.076 L308.909553,20 Z M311,36.3125 L293,36.3125 L293,39.6875 L311,39.6875 L311,36.3125 Z"></path>
        </g>
      </g>
    </svg>
  );
};
