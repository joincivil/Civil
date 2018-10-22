import * as React from "react";

export interface ClockIconProps {
  height?: number;
  width?: number;
}

export const ClockIcon: React.SFC<ClockIconProps> = props => {
  const width = (props.width || 18).toString();
  const height = (props.height || 18).toString();
  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      viewBox={`0 0 ${width} ${height}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-555.000000, -1467.000000)" fill="#8B8581">
          <g transform="translate(532.000000, 1110.000000)">
            <g transform="translate(23.000000, 357.000000)">
              <g>
                <path d="M9,0 C4.05,0 0,4.05 0,9 C0,13.95 4.05,18 9,18 C13.95,18 18,13.95 18,9 C18,4.05 13.95,0 9,0 L9,0 Z M9,16.2 C5.04,16.2 1.8,12.96 1.8,9 C1.8,5.04 5.04,1.8 9,1.8 C12.96,1.8 16.2,5.04 16.2,9 C16.2,12.96 12.96,16.2 9,16.2 L9,16.2 Z" />
                <polygon points="9.45 4.5 8.1 4.5 8.1 9.9 12.78 12.78 13.5 11.61 9.45 9.18" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
