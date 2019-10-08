import * as React from "react";
import styled, { ThemeProvider } from "styled-components";
import { withRouter, RouteComponentProps } from "react-router";
import {
  CivilContext,
  ICivilContext,
  RENDER_CONTEXT,
  CivilIcon,
  DEFAULT_BUTTON_THEME,
  DEFAULT_CHECKBOX_THEME,
} from "@joincivil/components";
import { mediaQueries } from "@joincivil/elements";
import { Boost } from "./Boost";

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
      <CivilLogoLink href="https://registry.civil.co" target="_blank">
        <CivilIcon />
      </CivilLogoLink>
      <ThemeProvider theme={theme}>
        <Boost boostId={props.match.params.boostId} open={true} payment={!!props.match.params.payment} />
      </ThemeProvider>
    </>
  );
};

export const BoostLoader: React.ComponentType = withRouter(BoostLoaderComponent);
