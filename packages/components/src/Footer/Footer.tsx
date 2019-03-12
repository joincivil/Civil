import * as React from "react";

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

export const Footer: React.SFC<FooterProps> = props => {
  return (
    <StyledFooter>
      <StyledFooterInner>
        <StyledFooterInnerLeft>
          <StyledFooterLogo>
            <a href="https://civil.co">
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
                  <a href="https://github.com/joincivil" target="_blank">
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
                  <a href="https://blog.joincivil.com/" target="_blank">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="https://civil.co/press">Press</a>
                </li>
                <li>
                  <a href="https://civil.co/our-team">Team</a>
                </li>
                <li>
                  <a href="https://civil.co/partners">Partners</a>
                </li>
                <li>
                  <a href="https://civilfound.org/" target="_blank">
                    Civil Foundation
                  </a>
                </li>
                <li>
                  <a href="https://civilfound.org/#civil-council" target="_blank">
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
                  <a href="https://civil.co/contact">Contact</a>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li>
                  <b>Other</b>
                </li>
                <li>
                  <a href="https://civil.co/terms">Terms</a>
                </li>
                <li>
                  <a href="https://civil.co/privacy">Privacy</a>
                </li>
                <li>
                  <a href="https://civil.co/careers">Careers</a>
                </li>
              </ul>
            </div>
          </StyledFooterNav>
        </StyledFooterInnerLeft>

        <StyledFooterInnerRight>
          <StyledSlogan>#ownthenews</StyledSlogan>

          <StyledFooterSocial>
            <a href="https://twitter.com/civil" target="_blank">
              <TwitterIcon width={20} height={20} />
            </a>
            <a href="https://www.facebook.com/joincivil" target="_blank">
              <FacebookIcon width={20} height={20} />
            </a>
            <a href="https://www.instagram.com/join_civil" target="_blank">
              <InstagramIcon width={20} height={20} />
            </a>
            <a href="https://t.me/join_civil" target="_blank">
              <TelegramIcon width={20} height={20} />
            </a>
            <a href="https://blog.joincivil.com/" target="_blank">
              <MediumIcon width={20} height={20} />
            </a>
          </StyledFooterSocial>

          <StyledFooterCopyright>© {props.currentYear} The Civil Media Company</StyledFooterCopyright>
        </StyledFooterInnerRight>
      </StyledFooterInner>
    </StyledFooter>
  );
};
