import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

export interface TelegramIconProps {
  className?: string;
  height?: number;
  width?: number;
}

const _TelegramIcon = (props: TelegramIconProps) => {
  const height = props.height || 23;
  const width = props.width || 23;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 23 23"
      className={props.className}
    >
      <defs>
        <path id="a" d="M1 2h16.718v14.954H1z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          fill="#8b8581"
          fillRule="evenodd"
          transform="translate(0 .457)"
          d="M3.483 8.775L6.26 9.837c.2.076.35.243.404.45l.352 1.334a.662.662 0 0 1 .2-.408l6.951-6.69L3.483 8.776zm3.652 3.3l.502 1.9 1.08-.778-1.414-.96a.661.661 0 0 1-.168-.162zm3.118.565l3.744 2.54 2.02-10.6-7.296 7.02 1.514 1.028a.363.363 0 0 1 .018.012zm4.206 4.314a.661.661 0 0 1-.372-.114l-4.204-2.851L7.63 15.61a.662.662 0 0 1-1.027-.368l-1.132-4.29-4.045-1.547a.662.662 0 0 1-.008-1.233l15.38-6.12a.662.662 0 0 1 .908.741L15.11 16.415a.662.662 0 0 1-.65.538z"
          mask="url(#b)"
        />
      </g>
    </svg>
  );
};

export const TelegramIcon: StyledComponentClass<TelegramIconProps, "svg"> = styled(_TelegramIcon)`
  &:hover path {
    fill: white;
  }
`;
