import * as React from "react";
import { urlConstants as links } from "@joincivil/utils";

import { CivilIcon, TwitterIcon, FacebookIcon, InstagramIcon, MediumIcon, TelegramIcon } from "../icons";
import {
  StyledFooter,
  StyledFooterInner,
  StyledFooterInnerLeft,
  StyledFooterInnerRight,
  StyledFooterLogo,
  StyledFooterNav,
  StyledSlogan,
  StyledFooterSocial,
  StyledFooterCopyright,
} from "./FooterStyledComponents";

export interface FooterProps {
  currentYear: string;
}

export const Footer: React.FunctionComponent<FooterProps> = props => {
  return (
    <StyledFooter>
      <StyledFooterInner>
        <StyledFooterInnerLeft>
          <StyledFooterLogo>
            <a href={links.MARKETING_SITE}>
              <CivilIcon />
            </a>
          </StyledFooterLogo>

          <StyledFooterNav>
            <div>
              <ul>
                <li>
                  <b>For Developers</b>
                </li>
                <li>
                  <a href={links.GITHUB} target="_blank">
                    Github
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li>
                  <b>About</b>
                </li>
                <li>
                  <a href={links.MEDIUM} target="_blank">
                    Blog
                  </a>
                </li>
                <li>
                  <a href={links.PRESS}>Press</a>
                </li>
                <li>
                  <a href={links.TEAM}>Team</a>
                </li>
                <li>
                  <a href={links.PARTNERS}>Partners</a>
                </li>
                <li>
                  <a href={links.FOUNDATION} target="_blank">
                    Civil Foundation
                  </a>
                </li>
                <li>
                  <a href={links.COUNCIL} target="_blank">
                    Civil Council
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li>
                  <b>Contact Us</b>
                </li>
                <li>
                  <a href={links.CONTACT}>Contact</a>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li>
                  <b>Other</b>
                </li>
                <li>
                  <a href={links.TERMS}>Terms</a>
                </li>
                <li>
                  <a href={links.PRIVACY_POLICY}>Privacy</a>
                </li>
                <li>
                  <a href={links.CAREERS}>Careers</a>
                </li>
              </ul>
            </div>
          </StyledFooterNav>
        </StyledFooterInnerLeft>

        <StyledFooterInnerRight>
          <StyledSlogan>#ownthenews</StyledSlogan>

          <StyledFooterSocial>
            <a href={links.TWITTER} target="_blank">
              <TwitterIcon width={20} height={20} />
            </a>
            <a href={links.FACEBOOK} target="_blank">
              <FacebookIcon width={20} height={20} />
            </a>
            <a href={links.INSTAGRAM} target="_blank">
              <InstagramIcon width={20} height={20} />
            </a>
            <a href={links.TELEGRAM} target="_blank">
              <TelegramIcon width={20} height={20} />
            </a>
            <a href={links.MEDIUM} target="_blank">
              <MediumIcon width={20} height={20} />
            </a>
          </StyledFooterSocial>

          <StyledFooterCopyright>© {props.currentYear} The Civil Media Company</StyledFooterCopyright>
        </StyledFooterInnerRight>
      </StyledFooterInner>
    </StyledFooter>
  );
};
