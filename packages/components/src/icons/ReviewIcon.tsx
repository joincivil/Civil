import * as React from "react";

export interface ReviewIconProps {
  className?: string;
}

export const ReviewIcon: React.SFC<ReviewIconProps> = props => {
  return (
    <svg className={props.className} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <path d="m0 0h24v24h-24z" />
        <path
          d="m12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm1 15h-2v-2h2zm0-4h-2v-6h2z"
          fill="#4066ff"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
};
