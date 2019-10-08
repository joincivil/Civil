import * as React from "react";
import { colors } from "../colors";

export const LockOpenIcon: React.FunctionComponent = props => {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill={colors.accent.CIVIL_RED} fillRule="evenodd">
        <path d="M6.85714286,13.7142857 C7.8,13.7142857 8.57142857,12.9428571 8.57142857,12 C8.57142857,11.0571429 7.8,10.2857143 6.85714286,10.2857143 C5.91428571,10.2857143 5.14285714,11.0571429 5.14285714,12 C5.14285714,12.9428571 5.91428571,13.7142857 6.85714286,13.7142857 L6.85714286,13.7142857 Z M12,6 L11.1428571,6 L11.1428571,4.28571429 C11.1428571,1.88571429 9.25714286,0 6.85714286,0 C4.45714286,0 2.57142857,1.88571429 2.57142857,4.28571429 L4.2,4.28571429 C4.2,2.82857143 5.4,1.62857143 6.85714286,1.62857143 C8.31428571,1.62857143 9.51428571,2.82857143 9.51428571,4.28571429 L9.51428571,6 L1.71428571,6 C0.771428571,6 0,6.77142857 0,7.71428571 L0,16.2857143 C0,17.2285714 0.771428571,18 1.71428571,18 L12,18 C12.9428571,18 13.7142857,17.2285714 13.7142857,16.2857143 L13.7142857,7.71428571 C13.7142857,6.77142857 12.9428571,6 12,6 L12,6 Z M12,16.2857143 L1.71428571,16.2857143 L1.71428571,7.71428571 L12,7.71428571 L12,16.2857143 L12,16.2857143 Z" />
      </g>
    </svg>
  );
};