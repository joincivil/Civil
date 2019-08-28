import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";

export interface CivilIconProps {
  className?: string;
  height?: number;
  width?: number;
}

const _CivilIcon = (props: CivilIconProps) => {
  const height = props.height || 21;
  const width = props.width || 72;
  return (
    <svg
      height={height}
      viewBox="0 0 72 21"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <g fill={colors.primary.BLACK} fillRule="evenodd" transform="translate(0 .457)">
        <path d="M.5 10c0-5.76 4.357-10 9.856-10 3.58 0 6.069 1.414 7.729 3.77L15.75 5.445c-1.297-1.728-2.905-2.67-5.499-2.67-3.838 0-6.64 3.089-6.64 7.225 0 4.24 2.853 7.225 6.744 7.225 2.49 0 4.357-.942 5.81-2.827L18.5 16.02C16.529 18.691 13.987 20 10.252 20 4.805 20 .5 15.76.5 10M22.5 20h3V1h-3zM29 1h3.382l5.782 13.228L43.782 1H47l-8.782 20h-.163zM50.5 20h3V1h-3zM59.5 1h3.175v16.344H71.5V20h-12z" />
      </g>
    </svg>
  );
};

export const CivilIcon = styled(_CivilIcon)`
  &:hover g {
    fill: ${colors.accent.CIVIL_BLUE};
  }
`;
