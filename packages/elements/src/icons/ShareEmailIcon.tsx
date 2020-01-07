import * as React from "react";

export interface ShareEmailIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const ShareEmailIcon: React.FunctionComponent<ShareEmailIconProps> = props => {
  const color = props.color || "#191919";
  const width = (props.width || 32).toString();
  const height = (props.height || 32).toString();
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-977.000000, -505.000000)">
          <g transform="translate(931.000000, 482.000000)">
            <g transform="translate(0.000000, 23.000000)">
              <g transform="translate(46.000000, 0.000000)">
                <polygon points="4 4 28 4 28 28 4 28"></polygon>
                <path
                  d="M24,8 L8,8 C6.9,8 6.01,8.9 6.01,10 L6,22 C6,23.1 6.9,24 8,24 L24,24 C25.1,24 26,23.1 26,22 L26,10 C26,8.9 25.1,8 24,8 Z M23.6,12.25 L16.53,16.67 C16.21,16.87 15.79,16.87 15.47,16.67 L8.4,12.25 C8.15,12.09 8,11.82 8,11.53 C8,10.86 8.73,10.46 9.3,10.81 L16,15 L22.7,10.81 C23.27,10.46 24,10.86 24,11.53 C24,11.82 23.85,12.09 23.6,12.25 Z"
                  fill={color}
                  fillRule="nonzero"
                ></path>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
