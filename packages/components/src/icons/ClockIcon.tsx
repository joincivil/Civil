import * as React from "react";

export interface ClockIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const ClockIcon: React.FunctionComponent<ClockIconProps> = props => {
  const color = props.color || "#8B8581";
  const width = (props.width || 18).toString();
  const height = (props.height || 18).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill={color} fillRule="evenodd">
        <path d="M9 0C4.05 0 0 4.05 0 9 0 13.95 4.05 18 9 18 13.95 18 18 13.95 18 9 18 4.05 13.95 0 9 0L9 0ZM9 16.2C5.04 16.2 1.8 12.96 1.8 9 1.8 5.04 5.04 1.8 9 1.8 12.96 1.8 16.2 5.04 16.2 9 16.2 12.96 12.96 16.2 9 16.2L9 16.2Z" />
        <polygon points="9.45 4.5 8.1 4.5 8.1 9.9 12.78 12.78 13.5 11.61 9.45 9.18" />
      </g>
    </svg>
  );
};
