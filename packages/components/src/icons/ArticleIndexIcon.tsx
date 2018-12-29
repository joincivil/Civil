import * as React from "react";

export interface ArticleIndexIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const ArticleIndexIcon = (props: ArticleIndexIconProps): JSX.Element => {
  const color = props.color || "#444";
  const width = (props.width || 24).toString();
  const height = (props.height || 24).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-1348 -46)translate(160 32)translate(1070 11)translate(118 3)">
          <g opacity="0.3">
            <polygon points="0 0 24 0 24 24 0 24" />
          </g>
          <g fillRule="nonzero" fill={color}>
            <path d="M19 13.91L17 15.792 17 9 12 9 12 5.101 5 5.101 5 20 9.694 20 11.69 22 4.99 22C3.89 22 3 21.1 3 20L3.083 4.981C3.083 3.881 3.973 2.981 5.073 2.981L13.073 2.981 19 9.104 19 13.91Z" />
          </g>
          <polygon fillRule="nonzero" points="20.6 15 15.47 20.17 13.4 18.09 12 19.5 15.47 23 22 16.41" fill={color} />
        </g>
      </g>
    </svg>
  );
};
