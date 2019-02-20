import * as React from "react";

export interface HollowRedNoGoodProps {
  color?: string;
  height?: number;
  width?: number;
}

export const HollowRedNoGood: React.SFC<HollowRedNoGoodProps> = props => {
  const color = props.color || "#f2524a";
  const width = (props.width || 20).toString();
  const height = (props.height || 20).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd" transform="translate(1 1)">
        <path d="m0 0h18v18h-18z" />
        <path
          d="m9 0c-4.968 0-9 4.032-9 9s4.032 9 9 9 9-4.032 9-9-4.032-9-9-9zm0 16.2c-3.978 0-7.2-3.222-7.2-7.2 0-1.665.567-3.195 1.521-4.41l10.089 10.089c-1.215.954-2.745 1.521-4.41 1.521zm5.679-2.79-10.089-10.089c1.215-.954 2.745-1.521 4.41-1.521 3.978 0 7.2 3.222 7.2 7.2 0 1.665-.567 3.195-1.521 4.41z"
          fill={color}
          fillRule="nonzero"
          className="svg-fill"
        />
      </g>
    </svg>
  );
};
