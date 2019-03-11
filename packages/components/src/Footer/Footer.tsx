import * as React from "react";

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
              <svg xmlns="http://www.w3.org/2000/svg" width="72" height="21">
                <g fill="#000">
                  <path d="M.5 10c0-5.76 4.357-10 9.856-10 3.58 0 6.069 1.414 7.729 3.77L15.75 5.445c-1.297-1.728-2.905-2.67-5.499-2.67-3.838 0-6.64 3.089-6.64 7.225 0 4.24 2.853 7.225 6.744 7.225 2.49 0 4.357-.942 5.81-2.827L18.5 16.02C16.529 18.691 13.987 20 10.252 20 4.805 20 .5 15.76.5 10M22.5 20h3V1h-3zM29 1h3.382l5.782 13.228L43.782 1H47l-8.782 20h-.163zM50.5 20h3V1h-3zM59.5 1h3.175v16.344H71.5V20h-12z" />
                </g>
              </svg>
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
            <a
              className="twitter js--ga-track"
              href="https://twitter.com/civil"
              target="_blank"
              data-ga-category="Social Signups: Footer"
              data-ga-label="Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <path
                  fill="#5a5653"
                  d="M18.329 4.768a6.735 6.735 0 0 1-1.926.537 3.424 3.424 0 0 0 1.474-1.885 6.863 6.863 0 0 1-2.131.82 3.316 3.316 0 0 0-2.448-1.08c-1.852 0-3.354 1.525-3.354 3.404 0 .27.03.53.087.778C7.243 7.21 4.77 5.85 3.118 3.793a3.38 3.38 0 0 0-.454 1.714c0 1.184.593 2.224 1.491 2.836a3.304 3.304 0 0 1-1.518-.427v.042c0 1.652 1.154 3.029 2.69 3.342a3.356 3.356 0 0 1-1.508.059c.43 1.352 1.666 2.338 3.138 2.366A6.661 6.661 0 0 1 2 15.135a9.434 9.434 0 0 0 5.151 1.53c6.172 0 9.543-5.19 9.543-9.683 0-.145 0-.29-.01-.436a6.832 6.832 0 0 0 1.677-1.764l-.032-.014z"
                />
              </svg>
            </a>
            <a
              className="facebook js--ga-track"
              href="https://www.facebook.com/joincivil"
              target="_blank"
              data-ga-category="Social Signups: Footer"
              data-ga-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <path
                  fill="#5a5653"
                  d="M17.117 2H2.883A.883.883 0 0 0 2 2.883v14.234c0 .488.395.883.883.883h7.662v-6.196H8.46V9.39h2.086V7.607c0-2.066 1.263-3.19 3.106-3.19.884 0 1.643.064 1.864.094v2.16h-1.28c-1 0-1.195.48-1.195 1.18v1.541h2.39l-.31 2.42h-2.08V18h4.077a.882.882 0 0 0 .883-.883V2.883A.882.882 0 0 0 17.117 2"
                />
              </svg>
            </a>
            <a
              className="instagram js--ga-track"
              href="https://www.instagram.com/join_civil"
              target="_blank"
              data-ga-category="Social Signups: Footer"
              data-ga-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <path
                  fill="#5a5653"
                  d="M10 2c-2.173 0-2.445.01-3.298.048-.852.04-1.432.174-1.942.372a3.918 3.918 0 0 0-1.417.923c-.445.444-.72.89-.923 1.417-.198.51-.333 1.09-.372 1.942C2.008 7.555 2 7.827 2 10s.01 2.445.048 3.298c.04.851.174 1.432.372 1.942.204.525.478.973.923 1.417a3.9 3.9 0 0 0 1.417.923c.51.197 1.09.333 1.942.372.853.04 1.125.048 3.298.048s2.445-.01 3.298-.048c.851-.04 1.432-.175 1.942-.372a3.932 3.932 0 0 0 1.417-.923 3.9 3.9 0 0 0 .923-1.417c.197-.51.333-1.09.372-1.942.04-.853.048-1.125.048-3.298s-.01-2.445-.048-3.298c-.04-.851-.175-1.433-.372-1.942a3.926 3.926 0 0 0-.923-1.417 3.898 3.898 0 0 0-1.417-.923c-.51-.198-1.09-.333-1.942-.372C12.445 2.008 12.173 2 10 2zm0 1.44c2.135 0 2.39.01 3.233.047.78.037 1.204.166 1.485.277.375.145.64.318.921.597.28.28.453.546.598.921.109.281.24.705.275 1.485.038.844.047 1.097.047 3.233s-.01 2.39-.05 3.233c-.04.78-.17 1.204-.28 1.485-.15.375-.32.64-.6.921-.279.28-.549.453-.92.598-.28.109-.71.24-1.49.275-.849.038-1.099.047-3.239.047-2.14 0-2.39-.01-3.24-.05-.78-.04-1.21-.17-1.49-.28a2.49 2.49 0 0 1-.92-.6 2.43 2.43 0 0 1-.6-.92c-.11-.28-.239-.71-.28-1.49-.03-.84-.04-1.099-.04-3.229s.01-2.39.04-3.24c.041-.78.17-1.21.28-1.49.14-.38.32-.64.6-.92.28-.28.54-.46.92-.6.28-.11.7-.24 1.48-.28.85-.03 1.1-.04 3.24-.04l.03.02zm0 2.452a4.108 4.108 0 1 0 0 8.215 4.108 4.108 0 0 0 0-8.215zm0 6.775a2.666 2.666 0 1 1 0-5.334 2.666 2.666 0 1 1 0 5.334zm5.23-6.937a.96.96 0 1 1-1.92-.001.96.96 0 0 1 1.92.001z"
                />
              </svg>
            </a>
            <a
              className="telegram js--ga-track"
              href="https://t.me/join_civil"
              target="_blank"
              data-ga-category="Social Signups: Footer"
              data-ga-label="Telegram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <defs>
                  <path id="a" d="M1 2h16.718v14.954H1z" />
                </defs>
                <g fill="none" fill-rule="evenodd">
                  <path
                    fill="#5a5653"
                    d="M3.483 8.775L6.26 9.837c.2.076.35.243.404.45l.352 1.334a.662.662 0 0 1 .2-.408l6.951-6.69L3.483 8.776zm3.652 3.3l.502 1.9 1.08-.778-1.414-.96a.661.661 0 0 1-.168-.162zm3.118.565l3.744 2.54 2.02-10.6-7.296 7.02 1.514 1.028a.363.363 0 0 1 .018.012zm4.206 4.314a.661.661 0 0 1-.372-.114l-4.204-2.851L7.63 15.61a.662.662 0 0 1-1.027-.368l-1.132-4.29-4.045-1.547a.662.662 0 0 1-.008-1.233l15.38-6.12a.662.662 0 0 1 .908.741L15.11 16.415a.662.662 0 0 1-.65.538z"
                    mask="url(#b)"
                  />
                </g>
              </svg>
            </a>
            <a
              className="medium js--ga-track"
              href="https://blog.joincivil.com/"
              target="_blank"
              data-ga-category="Social Signups: Footer"
              data-ga-label="Medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <path
                  fill="#5a5653"
                  d="M3.135 5.27a.696.696 0 0 0-.228-.588l-1.68-2.025v-.302h5.218l4.034 8.846 3.546-8.846H19v.302l-1.438 1.378a.421.421 0 0 0-.16.403v10.125a.421.421 0 0 0 .16.403l1.403 1.378v.302h-7.058v-.302l1.453-1.412c.143-.142.143-.184.143-.403V6.345L9.46 16.612h-.545L4.209 6.345v6.88a.95.95 0 0 0 .26.79l1.89 2.295v.301H1v-.302l1.89-2.295a.916.916 0 0 0 .244-.789V5.27z"
                />
              </svg>
            </a>
          </StyledFooterSocial>

          <StyledFooterCopyright>© {props.currentYear} The Civil Media Company</StyledFooterCopyright>
        </StyledFooterInnerRight>
      </StyledFooterInner>
    </StyledFooter>
  );
};
