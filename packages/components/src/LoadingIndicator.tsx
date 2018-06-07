import * as React from "react";
import { colors } from "./styleConstants";

export interface LoadingIndicatorProps {
  height?: string | number;
  width?: string | number;
}

export const LoadingIndicator: React.StatelessComponent<LoadingIndicatorProps> = props => {
  let height = props.height || "32";

  if (typeof height === "number") {
    height = height.toString();
  }
  let width = props.width || height;
  if (typeof width === "number") {
    width = width.toString();
  }
  const getCenterY = (): string => {
    return Math.floor(parseInt(height as string, 10) / 2).toString();
  };
  const getViewbox = (): string => {
    return `0 0 ${width} ${height}`;
  };
  const getCircleRadius = (): string => {
    return Math.floor(parseInt(height as string, 10) / 8).toString();
  };
  const getAnimatedCircleRadius = (): string => {
    const circleR = getCircleRadius();
    return `0; ${circleR}; 0; 0`;
  };
  const getCircleOffsetX = (circleNum: number): string => {
    return Math.floor(parseInt(width as string, 10) / 4 * circleNum).toString();
  };
  const getCircleTranslate = (circleNum: number): string => {
    const translateX = getCircleOffsetX(circleNum + 1);
    return `translate(${translateX} 0)`;
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={getViewbox()}
      width={width}
      height={height}
      fill={colors.accent.CIVIL_TEAL}
    >
      <circle transform={getCircleTranslate(0)} cx="0" cy={getCenterY()} r="0">
        <animate
          attributeName="r"
          values={getAnimatedCircleRadius()}
          dur="1.2s"
          repeatCount="indefinite"
          begin="0"
          keyTimes="0;0.2;0.7;1"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
          calcMode="spline"
        />
      </circle>
      <circle transform={getCircleTranslate(1)} cx="0" cy={getCenterY()} r="0">
        <animate
          attributeName="r"
          values={getAnimatedCircleRadius()}
          dur="1.2s"
          repeatCount="indefinite"
          begin="0.3"
          keyTimes="0;0.2;0.7;1"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
          calcMode="spline"
        />
      </circle>
      <circle transform={getCircleTranslate(2)} cx="0" cy={getCenterY()} r="0">
        <animate
          attributeName="r"
          values={getAnimatedCircleRadius()}
          dur="1.2s"
          repeatCount="indefinite"
          begin="0.6"
          keyTimes="0;0.2;0.7;1"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
          calcMode="spline"
        />
      </circle>
    </svg>
  );
};
