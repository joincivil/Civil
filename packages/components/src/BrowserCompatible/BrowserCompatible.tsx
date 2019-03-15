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

export interface BrowserCompatibleProps {
  supportEmail?: string;
  faqURL?: string;
}

export const BrowserCompatible: React.StatelessComponent<BrowserCompatibleProps> = props => {
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
        <BrowserCompatLinks href={props.supportEmail}>Contact Us</BrowserCompatLinks>
        <BrowserCompatLinks href={props.faqURL} target="_blank">
          Visit Support
        </BrowserCompatLinks>
      </OBSmallestParagraph>
    </BrowserCompatWrapper>
  );
};
