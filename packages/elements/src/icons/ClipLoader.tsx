import * as React from "react";
import styled, { keyframes } from "styled-components";
import { colors } from "../colors";

export interface ClipLoaderProps {
  size?: number;
  theme?: { clipLoaderColor: string };
}

const clip = keyframes`
0% {transform: rotate(0deg) scale(1)}
50% {transform: rotate(180deg) scale(1)}
100% {transform: rotate(360deg) scale(1)}
`;

export const ClipLoader = styled.div<ClipLoaderProps>`
  background: transparent;
  width: ${(props: any) => props.size}px;
  height: ${(props: any) => props.size}px;
  border-radius: 100%;
  border: 2px solid;
  border-color: ${props => props.theme.clipLoaderColor};
  border-bottom-color: transparent;
  display: inline-block;
  animation: ${clip} 0.75s 0s infinite linear;
  animation-fill-mode: both;
`;

ClipLoader.defaultProps = {
  size: 35,
  theme: {
    clipLoaderColor: colors.accent.CIVIL_GRAY_2,
  },
};
