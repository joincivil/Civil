import * as React from "react";
import { OBSectionTitle } from "../";
import { BrowserCompatIntroStyled } from "./BrowserCompatibleStyledComponents";

export const BrowserCompatHeadingText: React.SFC = props => (
  <OBSectionTitle>Can we switch to a different browser?</OBSectionTitle>
);

export const BrowserCompatIntroText: React.SFC = props => (
  <>
    <BrowserCompatIntroStyled>
      Civil Registry applications and token purchases currently only work in browsers with Ethereum wallet support, like
      desktop Chrome and Firefox. We’re working to support other browsers.
    </BrowserCompatIntroStyled>
    <BrowserCompatIntroStyled>In the meantime, please…</BrowserCompatIntroStyled>
  </>
);
