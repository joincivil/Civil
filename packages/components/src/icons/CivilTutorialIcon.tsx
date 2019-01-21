import * as React from "react";
import { colors } from "../styleConstants";

export const CivilTutorialIcon: React.SFC = props => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-1.5 -1.5)">
          <polygon points="0 0 22.909 0 22.909 22.909 0 22.909" />
          <path
            d="M14.318 3.818L14.318 10.5 4.935 10.5 4.372 11.063 3.818 11.617 3.818 3.818 14.318 3.818ZM15.273 1.909L2.864 1.909C2.339 1.909 1.909 2.339 1.909 2.864L1.909 16.227 5.727 12.409 15.273 12.409C15.798 12.409 16.227 11.98 16.227 11.455L16.227 2.864C16.227 2.339 15.798 1.909 15.273 1.909ZM20.045 5.727L18.136 5.727 18.136 14.318 5.727 14.318 5.727 16.227C5.727 16.752 6.157 17.182 6.682 17.182L17.182 17.182 21 21 21 6.682C21 6.157 20.57 5.727 20.045 5.727Z"
            fill={colors.accent.CIVIL_BLUE}
          />
        </g>
      </g>
    </svg>
  );
};
