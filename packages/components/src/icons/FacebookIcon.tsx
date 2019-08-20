import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

export interface FacebookIconProps {
  className?: string;
  height?: number;
  width?: number;
}

const _FacebookIcon = (props: FacebookIconProps) => {
  const height = props.height || 23;
  const width = props.width || 23;
  return (
    <svg
      height={height}
      viewBox="0 0 22 23"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path
        d="m63 1h-16c-1.1 0-2 .89612069-2 1.99137931v15.93103449c0 1.0952586.9 1.9913793 2 1.9913793h16c1.1 0 2-.8961207 2-1.9913793v-15.93103449c0-1.09525862-.9-1.99137931-2-1.99137931zm-1 1.99137931v2.98706897h-2c-.6 0-1 .39827586-1 .99568965v1.99137931h3v2.98706896h-3v6.9698276h-3v-6.9698276h-2v-2.98706896h2v-2.48922414c0-1.89181034 1.6-3.48491379 3.5-3.48491379z"
        fill="#8b8581"
        fillRule="evenodd"
        transform="translate(-44 .457)"
      />
    </svg>
  );
};

export const FacebookIcon: StyledComponentClass<FacebookIconProps, "svg"> = styled(_FacebookIcon)`
  &:hover path {
    fill: white;
  }
`;
