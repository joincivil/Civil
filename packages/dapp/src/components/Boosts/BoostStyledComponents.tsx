import * as React from "react";
import styled from "styled-components";
import { colors } from "@joincivil/components";

export const ComingSoonText: React.FunctionComponent = props => <ComingSoon>Coming soon!</ComingSoon>;

export const ComingSoon = styled.h3`
  margin: 150px 0 !important;
  text-align: center;
`;

export const BoostHeaderWrapper = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_3};
  padding: 50px 15px 50px;
  margin: 74px 0 30px;
`;

export const BoostHeader = styled.div`
  margin: 0 auto;
  max-width: 900px;
  position: relative;

  h1 {
    font-size: 36px;
    font-weight: bold;
    margin: 0;
  }

  a {
    bottom: -35px;
    left: 0;
    position: absolute;

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
      text-decoration: underline;
    }
  }
`;

export const BoostWrapper = styled.div`
  margin: 0 auto;
  max-width: 900px;
`;

export const BoostIntro = styled.div`
  margin: 0 auto 50px;

  p {
    color: ${colors.accent.CIVIL_GRAY_2};
    font-size: 18px;
    font-weight: 200;
    line-height: 26px;
    margin: 0 0 20px;
  }
`;
