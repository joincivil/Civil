import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { ChevronAnchor } from "@joincivil/components";
import { colors } from "@joincivil/elements";

const GlobalStyleNoScroll = createGlobalStyle`
  html, body {
    height: 100%;
    overflow: hidden;
  }
  body {
    border: 1px solid ${colors.accent.CIVIL_GRAY_4};
    margin: 1px; // otherwise border can be clipped by inner edge of iframe
    border-radius: 4px;
  }
`;
const OverflowLinkContainer = styled.div`
  position: absolute;
  z-index: 1;
  width: calc(100% - 2px);
  height: 100px;
  bottom: 1px;
  left: 1px;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.85) 25%,
    rgba(255, 255, 255, 1) 100%
  );
  border-radius: 4px;
`;
const OverflowLink = styled(ChevronAnchor)`
  position: absolute;
  display: block;
  width: 100%;
  bottom: 0;
  padding: 16px 0;
  background: white;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  text-align: center;
  &:hover {
    text-decoration: underline;
  }
`;

export interface BoostEmbedNoScrollProps {
  boostId: string;
}

export const BoostEmbedNoScroll: React.FunctionComponent<BoostEmbedNoScrollProps> = props => (
  <>
    <GlobalStyleNoScroll />
    <OverflowLinkContainer>
      <OverflowLink href={"https://registry.civil.co/boosts/" + props.boostId} target="_blank">
        View More
      </OverflowLink>
    </OverflowLinkContainer>
  </>
);
