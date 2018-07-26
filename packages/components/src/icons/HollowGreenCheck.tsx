import * as React from "react";

export const HollowGreenCheck = (): JSX.Element => {
  return (
    <svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd" transform="translate(1 1)">
        <circle cx="9" cy="9" r="8.25" stroke="#29cb42" strokeWidth="1.5" />
        <path d="m12.6 5-5.13 5.17-2.07-2.08-1.4 1.41 3.47 3.5 6.53-6.59z" fill="#29cb42" fillRule="nonzero" />
      </g>
    </svg>
  );
};
