import * as React from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { withRouter, RouteComponentProps } from "react-router";
import { CivilContext, ICivilContext, RENDER_CONTEXT } from "@joincivil/components";
import { colors } from "@joincivil/elements";
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
const OverflowLinkContainer = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100px;
  bottom: 0;
  left: 0;
  display: table;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.75) 25%,
    rgba(255, 255, 255, 1) 100%
  );
`;
const OverflowLink = styled.a`
  display: table-cell;
  text-align: center;
  vertical-align: middle;
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
    renderContext: RENDER_CONTEXT.EMBED,
  };

  return (
    <>
      <GlobalStyleNoScroll />
      <OverflowLinkContainer>
        <OverflowLink href={"https://registry.civil.co/boosts/" + props.match.params.boostId} target="_blank">
          View this Boost &gt;
        </OverflowLink>
      </OverflowLinkContainer>
      <ThemeProvider theme={theme}>
        <Boost boostId={props.match.params.boostId} open={true} payment={!!props.match.params.payment} />
      </ThemeProvider>
    </>
  );
};

export const BoostLoader: React.ComponentType = withRouter(BoostLoaderComponent);
