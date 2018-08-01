import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Button, buttonSizes } from "../Button";
// import img from "./img-hero-listings.png";

import { colors, fonts } from "../styleConstants";

const HeroOuter = styled.div`
  background-color: ${colors.primary.BLACK};
  background-image: none;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 70px 15px;
`;

const HeroInner = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 850px;
  text-align: center;
  width: 100%;
`;

const HeroLabel = styled.span`
  color: ${colors.basic.WHITE};
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.27px;
  margin-bottom: 30px;
`;

const HeroHeading = styled.h2`
  color: ${colors.basic.WHITE};
  font-family: ${fonts.SERIF};
  font-size: 38px;
  font-weight: 200;
  letter-spacing: -1px;
  line-height: 40px;
  margin: 0 auto 20px;
`;

const HeroBlockTextLink = styled.a`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_2};
  color: ${colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  font-size: 20px;
  margin-bottom: 40px;
  padding-bottom: 5px;
  text-decoration: none;
  transition: border-bottom 500ms;
  &:hover {
    border-bottom: 1px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.basic.WHITE};
  }
`;

const HeroSmallText = styled.small`
  color: ${colors.basic.WHITE};
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 17px;
  margin-top: 15px;
`;

export class HomepageHero extends React.Component {
  public render(): JSX.Element {
    return (
      <HeroOuter>
        <HeroInner>
          <HeroLabel>Civil Registry</HeroLabel>
          <HeroHeading>
            The Civil Registry is a whitelist of community-approved newsrooms that have publishing rights on Civil.
          </HeroHeading>
          <HeroBlockTextLink href="/home">Learn how to participate in our governance</HeroBlockTextLink>
          <Button size={buttonSizes.MEDIUM} to="/home">
            APPLY TO JOIN REGISTRY
          </Button>
          <HeroSmallText>1,000 CVL required to apply</HeroSmallText>
        </HeroInner>
      </HeroOuter>
    );
  }
}
