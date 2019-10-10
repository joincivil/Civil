import * as React from "react";
import styled, { ThemeProvider } from "styled-components";
import { useRouteMatch } from "react-router";
import {
  CivilContext,
  ICivilContext,
  RENDER_CONTEXT,
  CivilIcon,
  DEFAULT_BUTTON_THEME,
  DEFAULT_CHECKBOX_THEME,
} from "@joincivil/components";
import { mediaQueries } from "@joincivil/elements";
import { Boost } from "@joincivil/sdk";

import { embedRoutes } from "../constants";
import AppProvider from "../components/providers/AppProvider";

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
    padding-top: 25px;
    padding-right: 10px;
  }
  ${mediaQueries.MOBILE_SMALL} {
    padding-top: 22px;
    padding-left: 60px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 40%);
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

const BoostLoaderComponent: React.FunctionComponent = () => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  civilContext.renderContext = RENDER_CONTEXT.EMBED;
  const theme = {
    ...DEFAULT_CHECKBOX_THEME,
    ...DEFAULT_BUTTON_THEME,
    renderContext: RENDER_CONTEXT.EMBED,
  };

  // Due to a conflict between react-router v5's `BrowserRouter`, which we use, and react/redux `ConnectedRouter`, which we also use (and which would take an unknown/large refactor to change without breaking code splitting gains), neither `useParams` hook nor `withRouter` are receiving updates here, so we have to use `useRouteMatch` and manually provide the boost embed route. - @tobek
  const { boostId, payment } = useRouteMatch<BoostLoaderParams>(embedRoutes.BOOST)!.params;

  return (
    <>
      <CivilLogoLink href="https://registry.civil.co" target="_blank">
        <CivilIcon />
      </CivilLogoLink>
      <ThemeProvider theme={theme}>
        <Boost boostId={boostId} open={true} payment={!!payment} />
      </ThemeProvider>
    </>
  );
};

const BoostLoader: React.FunctionComponent = () => {
  return (
    <React.Suspense fallback={<></>}>
      <AppProvider>
        <BoostLoaderComponent />
      </AppProvider>
    </React.Suspense>
  );
};

export default BoostLoader;
