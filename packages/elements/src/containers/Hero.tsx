import * as React from "react";
import styled from "styled-components";

import { colors } from "../colors/index";
import { mediaQueries } from "./mediaQueries";
import { fonts } from "../text/fonts";

const HeroOuter = styled.div`
  background-color: ${colors.primary.BLACK};
  background-image: ${(props: HeroProps) => (props.backgroundImage ? "url(" + props.backgroundImage + ")" : "none")};
  background-repeat: no-repeat;
  background-size: cover;
  font-family: ${fonts.SANS_SERIF};
  padding: 78px 15px 32px;
  ${mediaQueries.MOBILE} {
    display: none;
  }
`;

export const HeroInner = styled.div`
  align-items: center;
  color: ${colors.basic.WHITE};
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 920px;
  text-align: center;
  width: 100%;
`;

export const StyledHeroHeading = styled.h2`
  font-family: ${fonts.SERIF};
  font-size: 48px;
  font-weight: 200;
  letter-spacing: -1px;
  line-height: 40px;
  margin: 0 auto 10px;
`;

export const StyledHeroCopy = styled.div`
  font-size: 18px;
  letter-spacing: -0.12px;
  line-height: 33px;
  margin: 0 0 40px;
  text-align: center;
  p {
    margin: 0 0 18px;
  }
  a {
    color: ${colors.basic.WHITE};
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_3};
  }
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledExplore = styled.div`
  color: ${colors.accent.CIVIL_GRAY_3};
  font-size: 12px;
  font-weight: bold;
  line-height: 15px;
  text-transform: uppercase;
  text-align: center;
  margin: 88px 0 0;
  div {
    margin: 12px 0 0;
  }
`;

export interface HeroProps {
  backgroundImage?: string;
  className?: string;
}

export const Hero: React.FunctionComponent<HeroProps> = props => {
  return (
    <HeroOuter backgroundImage={props.backgroundImage} className={props.className}>
      <HeroInner>{props.children}</HeroInner>
    </HeroOuter>
  );
};
