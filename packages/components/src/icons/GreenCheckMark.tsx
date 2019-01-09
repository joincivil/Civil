import * as React from "react";

export const GreenCheckMark = (): JSX.Element => {
  return (
    <svg height="26" viewBox="0 0 26 26" width="26" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle fill="#30e8bd" id="a" cx="12" cy="12" r="12" />
      </g>
      <g fill="none" fillRule="evenodd" transform="translate(1 1)">
        <g fill="#fff">
          <path
            fill="#fff"
            d="m9.464 17.092-3.466-3.415-1.156 1.138 4.622 4.553 9.904-9.756-1.155-1.138z"
            transform="translate(0 -2)"
          />
        </g>
      </g>
    </svg>
  );
};