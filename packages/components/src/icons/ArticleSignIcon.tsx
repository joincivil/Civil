import * as React from "react";

export interface ArticleSignIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const ArticleSignIcon: React.SFC<ArticleSignIconProps> = props => {
  const color = props.color || "#444";
  const width = (props.width || 24).toString();
  const height = (props.height || 24).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-1294 -46)translate(160 32)translate(1070 11)translate(64 3)">
          <polygon points="0 0 24 0 24 24 0 24" />
          <g transform="translate(3 4)" fillRule="nonzero" fill={color}>
            <path d="M8 8C10.21 8 12 6.21 12 4 12 1.79 10.21 0 8 0 5.79 0 4 1.79 4 4 4 6.21 5.79 8 8 8ZM8 2C9.1 2 10 2.9 10 4 10 5.1 9.1 6 8 6 6.9 6 6 5.1 6 4 6 2.9 6.9 2 8 2Z" />
            <path d="M2 14C2.2 13.37 4.57 12.32 6.96 12.06L9 10.06C8.61 10.02 8.32 10 8 10 5.33 10 0 11.34 0 14L0 16 9 16 7 14 2 14Z" />
            <polygon points="17.6 8.5 12.47 13.67 10.4 11.59 9 13 12.47 16.5 19 9.91" />
          </g>
        </g>
      </g>
    </svg>
  );
};
