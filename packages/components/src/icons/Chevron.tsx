import * as React from "react";
import styled from "styled-components";
import { colors } from "@joincivil/elements";

// @NOTE: See also `DisclosureArrowIcon` - slightly thicker version.

export interface ChevronProps {
  className?: string;
  height?: number;
  width?: number;
}

export const Chevron = (props: ChevronProps) => {
  const height = props.height || 14;
  const width = props.width || 14;
  return (
    <svg width={width} height={height} viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <polygon points="0 0 18 0 18 18 0 18"></polygon>
        <polygon
          fill={colors.primary.CIVIL_BLUE_1}
          fillRule="nonzero"
          points="7.5 4.5 6.4425 5.5575 9.8775 9 6.4425 12.4425 7.5 13.5 12 9"
        ></polygon>
      </g>
    </svg>
  );
};
