import * as React from "react";

export const CvlToken = (): JSX.Element => {
  return (
    <svg width="27" height="27" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)">
          <ellipse stroke="#fff" stroke-width="2" cx="28.5" cy="26" rx="21.5" ry="25" />
          <use stroke="#fff" stroke-width="4" stroke-linejoin="round" stroke-dasharray="4,4" />
          <path
            d="M25.71 1.277A18.695 18.695 0 0 0 22.5 1C10.66 1 1 12.163 1 26s9.66 25 21.5 25c1.084 0 2.156-.093 3.21-.277C15.099 48.918 7 38.515 7 26 7 13.485 15.098 3.082 25.71 1.277z"
            stroke="#000"
            stroke-width="2"
          />
          <path
            fill="#000"
            d="M12 3h6v2h-6zM7 7.667h6v2H7zM4 12.333h6v2H4zM2 21.667h5v2H2zM2 26.333h5v2H2zM2 31h5v2H2zM3 35.667h6v2H3zM6 40.333h5v2H6zM10 45h6v2h-6zM2 17h6v2H2z"
          />
        </g>
      </g>
    </svg>
  );
};
