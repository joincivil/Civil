import * as React from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { withRouter, RouteComponentProps } from "react-router";
import {
  CivilContext,
  ICivilContext,
  RENDER_CONTEXT,
  CivilIcon,
  ChevronAnchor,
  DEFAULT_BUTTON_THEME,
  DEFAULT_CHECKBOX_THEME,
} from "@joincivil/components";
import { colors, mediaQueries } from "@joincivil/elements";
import { Boost } from "./Boost";

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
const CivilLogoLink = styled.a`
  position: absolute;
  display: inline-block;
  z-index: 1000;
  top: 1px;
  right: 1px;
  padding: 34px 30px 0 75px;
  background: rgb(255, 255, 255);
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 35%);

  ${mediaQueries.MOBILE} {
    padding-top: 22px;
    padding-right: 10px;
  }
  ${mediaQueries.MOBILE_SMALL} {
    padding-left: 60px;
  }

  svg {
    width: 50px;
    height: auto;
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

export interface BoostLoaderParams {
  boostId: string;
  payment?: string;
}

const BoostLoaderComponent = (props: RouteComponentProps<BoostLoaderParams>) => {
  // @TODO/toby Once https://github.com/joincivil/Civil/pull/1432 is merged this should be set at the point at which embeds fork from other paths.
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  civilContext.renderContext = RENDER_CONTEXT.EMBED;
  const theme = {
    ...DEFAULT_CHECKBOX_THEME,
    ...DEFAULT_BUTTON_THEME,
    renderContext: RENDER_CONTEXT.EMBED,
  };

  return (
    <>
      <GlobalStyleNoScroll />
      <CivilLogoLink href="https://registry.civil.co" target="_blank">
        <CivilIcon />
      </CivilLogoLink>
      <OverflowLinkContainer>
        <OverflowLink href={"https://registry.civil.co/boosts/" + props.match.params.boostId} target="_blank">
          View More
        </OverflowLink>
      </OverflowLinkContainer>
      <ThemeProvider theme={theme}>
        <Boost boostId={props.match.params.boostId} open={true} payment={!!props.match.params.payment} />
      </ThemeProvider>
    </>
  );
};

export const BoostLoader: React.ComponentType = withRouter(BoostLoaderComponent);
