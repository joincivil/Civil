import * as React from "react";

export interface AvatarGenericIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const AvatarGenericIcon: React.FunctionComponent<AvatarGenericIconProps> = props => {
  const size = (props.size || 20).toString();
  const color = props.color || "#9B9B9B";

  return (
    <svg
      width={size}
      height={size}
      className={props.className}
      viewBox="0 0 20 20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="none" strokeWidth="1" fill={color} fillRule="evenodd">
        <path d="M10,0 C15.5,0 20,4.5 20,10 C20,15.5 15.5,20 10,20 C4.5,20 0,15.5 0,10 C0,4.5 4.5,0 10,0 Z M10,2 C5.581722,2 2,5.581722 2,10 C2,11.8075589 2.59947447,13.4751029 3.61045414,14.814663 C4.95335464,13.6348241 8.18364054,13 10,13 C11.8163595,13 15.0466454,13.6348241 16.388888,14.8146228 C17.4005255,13.4751029 18,11.8075589 18,10 C18,5.581722 14.418278,2 10,2 Z M10,4 C12.2666667,4 14,5.73333333 14,8 C14,10.2666667 12.2666667,12 10,12 C7.73333333,12 6,10.2666667 6,8 C6,5.73333333 7.73333333,4 10,4 Z"></path>
      </g>
    </svg>
  );
};
