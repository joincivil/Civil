import * as React from "react";
import { colors } from "../styleConstants";

export const TrendsIcon: React.FunctionComponent = props => {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill={colors.accent.CIVIL_BLUE} fillRule="evenodd">
        <path
          d="M24,48 C10.766,48 0,37.234 0,24 C0,10.766 10.766,0 24,0 C37.234,0 48,10.766 48,24 C48,37.234 37.234,48 24,48 Z M24,2 C11.87,2 2,11.87 2,24 C2,36.13 11.87,46 24,46 C36.13,46 46,36.13 46,24 C46,11.87 36.13,2 24,2 Z"
          fillRule="nonzero"
        />
        <polygon points="36 24.9230769 34.0221193 24.9230769 34.0221193 17.6701884 26.7692308 17.6701884 26.7692308 15.6923077 35.0110596 15.6923077 36 16.681248" />
        <polygon points="14.3524956 31.3846154 12.9230769 29.9762196 19.7022011 23.2948061 20.7373671 23.0557573 26.2104029 24.8526073 34.5705813 16.6153846 36 18.0237804 27.1990673 26.6972671 26.1639013 26.938308 20.6908655 25.1394659" />
      </g>
    </svg>
  );
};
