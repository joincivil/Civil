import * as React from "react";

export const CvlToken = (): JSX.Element => {
  return (
    <svg width="32" height="33" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(1 1)" fill="none" fillRule="evenodd">
        <ellipse stroke="#fff" cx="17" cy="15.5" rx="13" ry="15.5" />
        <path
          d="M15 .172A11.117 11.117 0 0 0 13.051 0C5.864 0 0 6.921 0 15.5S5.864 31 13.051 31c.658 0 1.309-.058 1.949-.172C8.558 29.71 3.642 23.26 3.642 15.5 3.642 7.74 8.558 1.29 15 .172z"
          stroke="#fff"
        />
        <text fontFamily="LibreFranklin-Bold, Libre Franklin" fontSize="9" fill="#fff">
          <tspan x="8" y="18">
            CVL
          </tspan>
        </text>
        <g fill="#fff" fillRule="nonzero">
          <path d="M8 1h3v1.227H8zM3.813 3.864H8V5.09H3.812zM2.125 6.727H5.5v1.227H2.125zM0 12.455h3.813v1.227H0zM0 15.318h3.813v1.227H0zM0 18.182h3.813v1.227H0zM1 21.046h3.938v1.227H1zM2.969 23.909h3.094v1.227H2.969zM5.063 26.773h3.812V28H5.062zM1 9.59h3.375v1.228H1z" />
        </g>
      </g>
    </svg>
  );
};
