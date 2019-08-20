import * as React from "react";
import { colors } from "../styleConstants";

export const VerifyIdentityIcon: React.FunctionComponent = props => {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-2 -0.5)">
          <polygon points="0 0 22.9 0 22.9 22.9 0 22.9" />
          <path
            d="M11.5 1L2.9 4.8 2.9 10.5C2.9 15.8 6.5 20.8 11.5 22 16.4 20.8 20 15.8 20 10.5L20 4.8 11.5 1ZM18.1 10.5C18.1 14.8 15.3 18.8 11.5 20 7.6 18.8 4.8 14.8 4.8 10.5L4.8 6 11.5 3 18.1 6 18.1 10.5ZM7.1 11.1L5.7 12.4 9.5 16.2 17.2 8.6 15.8 7.2 9.5 13.5 7.1 11.1Z"
            fill={colors.accent.CIVIL_BLUE}
          />
        </g>
      </g>
    </svg>
  );
};
