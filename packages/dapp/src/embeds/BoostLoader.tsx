import * as React from "react";
import styled, { ThemeProvider } from "styled-components";
import { useParams } from "react-router";
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
  payment: boolean;
}

const BoostLoaderComponent: React.FunctionComponent<BoostLoaderParams> = ({ boostId, payment }) => {
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
        <Boost boostId={boostId} open={true} payment={!!payment} />
      </ThemeProvider>
    </>
  );
};

const BoostLoader: React.FunctionComponent = () => {
  const { boostId, payment } = useParams();
  return (
    <React.Suspense fallback={<></>}>
      <AppProvider>
        <BoostLoaderComponent boostId={boostId!} payment={!!payment} />
      </AppProvider>
    </React.Suspense>
  );
};

export default BoostLoader;
