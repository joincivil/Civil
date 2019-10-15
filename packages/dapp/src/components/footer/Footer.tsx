import * as React from "react";
import styled from "styled-components";

import {
  colors,
  fonts,
  mediaQueries,
  CivilIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  MediumIcon,
  TelegramIcon,
} from "@joincivil/elements";

import { links } from "../../helpers/links";

const StyledFooter = styled.footer`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  margin: 50px auto 0;
  max-width: 1440px;
  padding: 50px 30px;

  ${mediaQueries.MOBILE} {
    padding: 40px 15px;
  }
`;

const StyledFooterInner = styled.div`
  display: flex;
  justify-content: space-between;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

const StyledFooterInnerLeft = styled.div`
  display: flex;

  ${mediaQueries.MOBILE} {
    display: block;
    margin: 0 0 30px;
  }
`;

const StyledFooterInnerRight = styled.div`
  font-size: 12px;
  padding: 9px 0 0;
  text-align: right;

  ${mediaQueries.MOBILE} {
    padding: 9px 0 0;
    text-align: left;
  }
`;

const StyledFooterLogo = styled.div`
  margin-right: 50px;
  width: 74px;
`;

const StyledFooterNav = styled.nav`
  display: flex;

  ${mediaQueries.MOBILE} {
    display: block;
  }

  ul {
    margin: 0 20px;
    padding: 2px 0 0;
    width: 120px;

    ${mediaQueries.MOBILE} {
      margin: 0 0 15px;
      padding: 0;
      width: 100%;
    }
  }

  li {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 16px;
    line-height: 26px;
    list-style: none;
    margin: 0;
    text-align: left;
  }

  b {
    color: ${colors.primary.BLACK};
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    line-height: 26px;
    text-transform: uppercase;
  }

  a {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 12px;
    font-weight: 500;
    line-height: 28px;
    text-decoration: none;
    text-transform: uppercase;
    -webkit-transition: color 0.2s;
    transition: color 0.2s;
  }

  a:hover {
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

const StyledSlogan = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.8px;
  margin: 0 auto 10px;
  text-transform: uppercase;
`;

const StyledFooterSocial = styled.div`
  margin: 0 0 69px;

  ${TwitterIcon} path,
  ${FacebookIcon} path,
  ${InstagramIcon} path,
  ${MediumIcon} path,
  ${TelegramIcon} path {
    fill: ${colors.accent.CIVIL_GRAY_1};
  }

  ${TwitterIcon}:hover path,
  ${FacebookIcon}:hover path,
  ${InstagramIcon}:hover path,
  ${MediumIcon}:hover path,
  ${TelegramIcon}:hover path {
    fill: ${colors.accent.CIVIL_BLUE};
  }

  ${mediaQueries.MOBILE} {
    margin: 0 0 30px;
  }

  a {
    margin: 0 14px 0 0;
  }
`;

const StyledFooterCopyright = styled.span`
  color: ${colors.accent.CIVIL_GRAY_2};
  display: block;
  font-size: 12px;
`;

export const Footer: React.FunctionComponent = () => {
  const currentYear = new Date().getFullYear().toString();

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

          <StyledFooterCopyright>© {currentYear} The Civil Media Company</StyledFooterCopyright>
        </StyledFooterInnerRight>
      </StyledFooterInner>
    </StyledFooter>
  );
};

export default Footer;
