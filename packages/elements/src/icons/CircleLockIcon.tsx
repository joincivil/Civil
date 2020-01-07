import * as React from "react";

export interface CircleLockIconProps {
  color?: string;
  className?: string;
}

export const CircleLockIcon: React.FunctionComponent<CircleLockIconProps> = props => {
  const color = props.color || "#8B8581";
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <g fill="none" fillRule="evenodd" transform="translate(1 1)">
        <circle id="Oval-2" stroke={color} strokeWidth="2" cx="12" cy="12" r="9"></circle>
        <path
          d="M9.49609375,16.6660156 L14.5742188,16.6660156 C15.2480469,16.6660156 15.5703125,16.3339844 15.5703125,15.6015625 L15.5703125,11.6953125 C15.5703125,11.0507812 15.3261719,10.71875 14.8085938,10.640625 L14.8085938,9.47851562 C14.8085938,7.57421875 13.65625,6.34375 12.0351562,6.34375 C10.4140625,6.34375 9.26171875,7.57421875 9.26171875,9.47851562 L9.26171875,10.6503906 C8.74414062,10.7285156 8.5,11.0605469 8.5,11.6953125 L8.5,15.6015625 C8.5,16.3339844 8.82226562,16.6660156 9.49609375,16.6660156 Z M10.2773438,9.37109375 C10.2773438,8.140625 10.9804688,7.33007812 12.0351562,7.33007812 C13.0898438,7.33007812 13.7929688,8.140625 13.7929688,9.37109375 L13.7929688,10.6308594 L10.2773438,10.6308594 L10.2773438,9.37109375 Z"
          fill={color}
          fillRule="nonzero"
        ></path>
      </g>
    </svg>
  );
};
