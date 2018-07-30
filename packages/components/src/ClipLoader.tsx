import * as React from "react";
import styled, {StyledComponentClass, keyframes} from "styled-components";
import { colors } from "./styleConstants";

export interface ClipLoaderProps {
  size?: number;
  theme?: any;
}

const clip = keyframes`
0% {transform: rotate(0deg) scale(1)}
50% {transform: rotate(180deg) scale(1)}
100% {transform: rotate(360deg) scale(1)}
`;

export const ClipLoader: StyledComponentClass<ClipLoaderProps, "div"> = styled<ClipLoaderProps, "div">("div")`
  background: transparentt;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
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
  }
};
