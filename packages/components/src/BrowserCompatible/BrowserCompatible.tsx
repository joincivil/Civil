import * as React from "react";
import { buttonSizes, OBSmallestParagraph } from "../";
import {
  BrowserCompatWrapper,
  BrowserLogo,
  BrowserButtons,
  BrowserButton,
  BrowserCompatLinks,
} from "./BrowserCompatibleStyledComponents";
import { BrowserCompatHeadingText, BrowserCompatIntroText } from "./BrowserCompatibleTextComponents";
import * as chromeLogoImgUrl from "../images/img-chrome-logo@2x.png";
import * as firefoxLogoImgUrl from "../images/img-firefox-logo@2x.png";
import { urlConstants as links } from "@joincivil/utils";

export const BrowserCompatible: React.StatelessComponent = props => {
  return (
    <BrowserCompatWrapper>
      <BrowserCompatHeadingText />
      <BrowserCompatIntroText />

      <BrowserButtons>
        <BrowserButton size={buttonSizes.MEDIUM_WIDE} href="https://www.google.com/chrome/" target="_blank">
          <BrowserLogo src={chromeLogoImgUrl} />
          Get Google Chrome
        </BrowserButton>
        <BrowserButton size={buttonSizes.MEDIUM_WIDE} href="https://www.mozilla.org/en-US/firefox/" target="_blank">
          <BrowserLogo src={firefoxLogoImgUrl} />
          Get Firefox
        </BrowserButton>
      </BrowserButtons>

      <OBSmallestParagraph>
        <BrowserCompatLinks href={"mailto:" + `${links.EMAIL_SUPPORT}`}>Contact Us</BrowserCompatLinks>
        <BrowserCompatLinks href={links.FAQ_HOME} target="_blank">
          Visit Support
        </BrowserCompatLinks>
      </OBSmallestParagraph>
    </BrowserCompatWrapper>
  );
};
