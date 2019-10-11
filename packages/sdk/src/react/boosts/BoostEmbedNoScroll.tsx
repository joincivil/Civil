import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { ChevronAnchor } from "@joincivil/components";
import { colors } from "@joincivil/elements";

const GlobalStyleNoScroll = createGlobalStyle`
  html, body {
    height: 100%;
    overflow: hidden;
    margin: 0;
  }
`;
const OverflowLinkContainer = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100px;
  bottom: 0;
  left: 0;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.85) 25%,
    rgba(255, 255, 255, 1) 100%
  );
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
      <OverflowLink href={`${document.location.origin}/boosts/${props.boostId}`} target="_blank">
        View More
      </OverflowLink>
    </OverflowLinkContainer>
  </>
);
