import * as React from "react";
import styled, { ThemeProvider } from "styled-components/macro";
// @ts-ignore iframe-resizer types are crap and it thinks this module isn't exported
import { iframeResizerContentWindow } from "iframe-resizer";
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
import { StoryBoost } from "@joincivil/sdk";

import { routes, embedRoutes } from "../constants";
import AppProvider from "../components/providers/AppProvider";

const EmbedWrapper = styled.div`
  // obscure embed loading message outside iframe:
  background: white;
`;
const CivilLogoLink = styled.a`
  position: absolute;
  display: inline-block;
  z-index: 2; // above basic stuff, below full screen modal mask
  top: 0;
  right: 0;
  padding: 20px 30px 0 20px;
  background: rgb(255, 255, 255);
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 35%);
  ${mediaQueries.MOBILE} {
    padding-right: 10px;
  }
  ${mediaQueries.MOBILE_SMALL} {
    padding-top: 16px;
    padding-left: 60px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 40%);
  }
  svg {
    width: 50px;
    height: auto;
  }
`;

// @HACK We don't need to do anything with this object, but if we don't reference it then it looks like it gets optimized out and doesn't work.
console.log("iframeResizerContentWindow loaded", iframeResizerContentWindow);

export interface StoryBoostLoaderParams {
  boostId: string;
}

const StoryBoostLoaderComponent: React.FunctionComponent = () => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  civilContext.renderContext = RENDER_CONTEXT.EMBED;
  const theme = {
    ...DEFAULT_CHECKBOX_THEME,
    ...DEFAULT_BUTTON_THEME,
    renderContext: RENDER_CONTEXT.EMBED,
  };

  // Due to a conflict between react-router v5's `BrowserRouter`, which we use, and react/redux `ConnectedRouter`, which we also use (and which would take an unknown/large refactor to change without breaking code splitting gains), neither `useParams` hook nor `withRouter` are receiving updates here, so we have to use `useRouteMatch` and manually provide the boost embed route. - @tobek
  const { boostId } = useRouteMatch<StoryBoostLoaderParams>(embedRoutes.STORY_BOOST)!.params;

  return (
    <EmbedWrapper data-iframe-height>
      <CivilLogoLink href={routes.HOMEPAGE} target="_blank">
        <CivilIcon />
      </CivilLogoLink>
      <ThemeProvider theme={theme}>
        <StoryBoost boostId={boostId} />
      </ThemeProvider>
    </EmbedWrapper>
  );
};

const StoryBoostLoader: React.FunctionComponent = () => {
  return (
    <React.Suspense fallback={<></>}>
      <AppProvider data-iframe-height>
        <StoryBoostLoaderComponent />
      </AppProvider>
    </React.Suspense>
  );
};

export default StoryBoostLoader;
