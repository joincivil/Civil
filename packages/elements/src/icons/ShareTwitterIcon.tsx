import * as React from "react";

export interface ShareTwitterIconProps {
  color?: string;
  height?: number;
  width?: number;
}

export const ShareTwitterIcon: React.FunctionComponent<ShareTwitterIconProps> = props => {
  const color = props.color || "#191919";
  const width = (props.width || 32).toString();
  const height = (props.height || 32).toString();
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m28.954 8.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548z"
        fill={color}
        fillRule="nonzero"
      />
    </svg>
  );
};
