import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

export interface MediumIconProps {
  className?: string;
  height?: number;
  width?: number;
}

const _MediumIcon: React.SFC<MediumIconProps> = props => {
  const height = props.height || 23;
  const width = props.width || 23;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 23 23"
      className={props.className}
    >
      <path
        fill="#8b8581"
        fillRule="evenodd"
        transform="translate(0 .457)"
        d="M3.135 5.27a.696.696 0 0 0-.228-.588l-1.68-2.025v-.302h5.218l4.034 8.846 3.546-8.846H19v.302l-1.438 1.378a.421.421 0 0 0-.16.403v10.125a.421.421 0 0 0 .16.403l1.403 1.378v.302h-7.058v-.302l1.453-1.412c.143-.142.143-.184.143-.403V6.345L9.46 16.612h-.545L4.209 6.345v6.88a.95.95 0 0 0 .26.79l1.89 2.295v.301H1v-.302l1.89-2.295a.916.916 0 0 0 .244-.789V5.27z"
      />
    </svg>
  );
};

export const MediumIcon: StyledComponentClass<MediumIconProps, "svg"> = styled(_MediumIcon)`
  &:hover path {
    fill: white;
  }
`;
