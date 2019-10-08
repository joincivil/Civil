import * as React from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { withRouter, RouteComponentProps } from "react-router";
import { colors } from "@joincivil/elements";
import { CivilContext, ICivilContext, RENDER_CONTEXT, CivilIcon, ChevronAnchor } from "@joincivil/components";
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
`;
const OverflowLink = styled(ChevronAnchor)`
  bottom: 0;
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
        <OverflowLink href={"https://registry.civil.co/boosts/" + props.match.params.boostId} target="_blank">View More</OverflowLink>
      </OverflowLinkContainer>
      <ThemeProvider theme={theme}>
        <Boost boostId={props.match.params.boostId} open={true} payment={!!props.match.params.payment} />
      </ThemeProvider>
    </>
  );
};

export const BoostLoader: React.ComponentType = withRouter(BoostLoaderComponent);
