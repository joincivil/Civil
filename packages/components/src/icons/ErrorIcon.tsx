import * as React from "react";

export interface ErrorIconProps {
  className?: string;
  height?: number;
  width?: number;
}

export const ErrorIcon: React.FunctionComponent<ErrorIconProps> = props => {
  const height = (props.height || 28).toString();
  const width = (props.width || 28).toString();
  return (
    <svg
      className={props.className}
      height={height}
      viewBox="0 0 28 28"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fillRule="evenodd">
        <path d="m0 0h28v28h-28z" />
        <path
          d="m12.8333333 17.5h2.3333334v2.3333333h-2.3333334zm0-9.33333333h2.3333334v7.00000003h-2.3333334zm1.155-5.83333334c-6.43999997 0-11.65499997 5.22666667-11.65499997 11.66666667s5.215 11.6666667 11.65499997 11.6666667c6.4516667 0 11.6783334-5.2266667 11.6783334-11.6666667s-5.2266667-11.66666667-11.6783334-11.66666667zm.0116667 20.99999997c-5.15666667 0-9.33333333-4.1766666-9.33333333-9.3333333 0-5.15666667 4.17666666-9.33333333 9.33333333-9.33333333 5.1566667 0 9.3333333 4.17666666 9.3333333 9.33333333 0 5.1566667-4.1766666 9.3333333-9.3333333 9.3333333z"
          fill="#f2524a"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
};
