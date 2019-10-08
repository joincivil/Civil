import * as React from "react";
import styled from "styled-components";
import { colors, fonts, mediaQueries, ChevronAnchor } from "@joincivil/components";

export const ComingSoonText: React.FunctionComponent = props => <ComingSoon>Coming soon!</ComingSoon>;

export const ComingSoon = styled.h3`
  margin: 150px 0 !important;
  text-align: center;
`;

export const BoostHeaderWrapper = styled.div`
  padding: 20px 15px;
  margin: 74px 0 30px;
`;

export const BoostHeader = styled.div`
  font-family: ${fonts.SANS_SERIF};
  margin: 0 auto;
  max-width: 900px;
  position: relative;

  h1 {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-family: ${fonts.SANS_SERIF};
    font-size: 36px;
    font-weight: bold;
    line-height: 49px;
    margin: 0 0 10px;

    ${mediaQueries.MOBILE} {
      color: ${colors.primary.BLACK};
      font-size: 24px;
      line-height: 30px;
    }
  }
`;

export const BoostIntro = styled.p`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 18px;
  font-weight: 200;
  line-height: 26px;
  margin: 0 0 20px;

  ${mediaQueries.MOBILE} {
    color: ${colors.primary.BLACK};
    font-size: 16px;
    line-height: 24px;
  }
`;

export const BoostLearnMore = styled(ChevronAnchor)`
  color: ${colors.accent.CIVIL_BLUE};
  display: block;
  font-size: 15px;

  ${mediaQueries.MOBILE} {
    font-size: 13px;
  }

  &:hover {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: underline;
  }
`;

export const BoostWrapper = styled.div`
  margin: 0 auto;
  max-width: 900px;
`;
