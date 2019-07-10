import * as React from "react";
import { colors } from "../styleConstants";

export interface DashboardNewsroomApplicationIconProps {
  height?: number;
  width?: number;
}

export const DashboardNewsroomApplicationIcon: React.FunctionComponent<
  DashboardNewsroomApplicationIconProps
> = props => {
  const width = (props.width || 34).toString();
  const height = (props.height || 34).toString();

  return (
    <svg width={width} height={height} viewBox="0 0 34 34" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <rect x="518" y="148" width="760" height="875" />
        <filter x="-0.8%" y="-0.7%" width="101.6%" height="101.4%" filterUnits="objectBoundingBox">
          <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
          <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1" />
          <feColorMatrix
            values="0 0 0 0 0.768627451   0 0 0 0 0.760784314   0 0 0 0 0.752941176  0 0 0 1 0"
            type="matrix"
            in="shadowBlurOuter1"
          />
        </filter>
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-887.000000, -288.000000)">
          <rect fill={colors.basic.WHITE} x="0" y="0" width="1440" height="1352" />
          <polygon fillOpacity="0.06" fill={colors.accent.CIVIL_BLUE} points="0 67 1440 67 1440 664 0 664" />
          <g>
            <use fill="black" fillOpacity="1" filter="url(#filter-2)" />
            <rect stroke={colors.accent.CIVIL_GRAY_4} fillRule="evenodd" x="518.5" y="148.5" width="759" height="874" />
          </g>
          <g transform="translate(662.000000, 281.000000)">
            <g transform="translate(225.000000, 7.000000)">
              <path d="M0,0 L26,0 L26,27 L0,27 L0,0 Z M3,3 L3,24 L23,24 L23,3 L3,3 Z" fill={colors.accent.CIVIL_BLUE} />
              <path d="M6,6 L20,6 L20,13 L6,13 L6,6 Z M8,8 L8,11 L18,11 L18,8 L8,8 Z" fill={colors.accent.CIVIL_BLUE} />
              <polygon fill={colors.accent.CIVIL_BLUE} points="6 14.95 20 14.95 20 16.95 6 16.95" />
              <polygon fill={colors.accent.CIVIL_BLUE} points="6 18.85 20 18.85 20 20.85 6 20.85" />
              <g transform="translate(16.000000, 15.950000)">
                <circle
                  fill={colors.accent.CIVIL_BLUE}
                  fillRule="nonzero"
                  cx="9.2607145"
                  cy="9.2607145"
                  r="8.2607145"
                />
                <path
                  d="M9.9,4.5 L8.1,4.5 L8.1,8.1 L4.5,8.1 L4.5,9.9 L8.1,9.9 L8.1,13.5 L9.9,13.5 L9.9,9.9 L13.5,9.9 L13.5,8.1 L9.9,8.1 L9.9,4.5 L9.9,4.5 Z M9,0 C4.05,0 0,4.05 0,9 C0,13.95 4.05,18 9,18 C13.95,18 18,13.95 18,9 C18,4.05 13.95,0 9,0 L9,0 Z M9,16.2 C5.04,16.2 1.8,12.96 1.8,9 C1.8,5.04 5.04,1.8 9,1.8 C12.96,1.8 16.2,5.04 16.2,9 C16.2,12.96 12.96,16.2 9,16.2 L9,16.2 Z"
                  fill={colors.basic.WHITE}
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
