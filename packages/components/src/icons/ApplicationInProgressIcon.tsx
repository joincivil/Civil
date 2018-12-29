import * as React from "react";
import { colors } from "../styleConstants";

export interface ApplicationInProgressProps {
  color?: string;
  height?: number;
  width?: number;
}

export const ApplicationInProgressIcon: React.SFC<ApplicationInProgressProps> = props => {
  const color = props.color || colors.primary.CIVIL_GRAY_2;
  const width = (props.width || 19).toString();
  const height = (props.height || 18).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 0c3.316 0 6.253 1.8 7.768 4.547l2.18-2.179v6.158h-6.159l2.653-2.652c-1.231-2.369-3.6-3.98-6.442-3.98-3.884 0-7.105 3.222-7.105 7.106S5.115 16.105 9 16.105c3.126 0 5.684-1.99 6.726-4.737h1.99C16.674 15.158 13.168 18 9 18c-5.021 0-9-4.074-9-9s4.074-9 9-9zM7.401 4.737v4.831l4.453 2.653.758-1.232-3.79-2.273v-3.98h-1.42z"
        fill={color}
        opacity=".9"
      />
    </svg>
  );
};
