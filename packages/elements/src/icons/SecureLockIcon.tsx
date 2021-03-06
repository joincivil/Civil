import * as React from "react";

export interface SecureLockIconProps {
  color?: string;
}

export const SecureLockIcon = (props: SecureLockIconProps) => {
  const color = props.color || "#8B8581";
  return (
    <svg width="20" height="23" viewBox="0 0 20 23" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect x="0" y="1.2520731" width="20" height="20"></rect>
        <path
          d="M16,8.5041462 L13.75,8.5041462 L13.75,7.1616462 C13.75,5.2041462 12.3175,3.4566462 10.3675,3.2691462 C8.1325,3.0591462 6.25,4.8141462 6.25,7.0041462 L6.25,8.5041462 L4,8.5041462 L4,19.0041462 L16,19.0041462 L16,8.5041462 Z M10,12.2541462 C10.825,12.2541462 11.5,12.9291462 11.5,13.7541462 C11.5,14.5791462 10.825,15.2541462 10,15.2541462 C9.175,15.2541462 8.5,14.5791462 8.5,13.7541462 C8.5,12.9291462 9.175,12.2541462 10,12.2541462 Z M10,4.7541462 C11.245,4.7541462 12.25,5.7591462 12.25,7.0041462 L12.25,8.5041462 L7.75,8.5041462 L7.75,7.0041462 C7.75,5.7591462 8.755,4.7541462 10,4.7541462 Z"
          fill={color}
          fillRule="nonzero"
        ></path>
      </g>
    </svg>
  );
};
