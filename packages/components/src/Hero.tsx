import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "./styleConstants";

export const HeroOuter = styled.div`
  background-color: ${props => props.theme.backgroundColor};
  background-image: ${props => props.theme.backgroundImage};
  background-repeat: no-repeat;
  background-size: cover;
  padding: 70px 15px;
`;

HeroOuter.defaultProps = {
  theme: {
    backgroundColor: colors.primary.BLACK,
    backgroundImage: "none",
  },
};

const HeroInner = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 850px;
  text-align: center;
  width: 100%;
`;

export const HeroLabel = styled.span`
  color: ${props => props.theme.color};
  display: block;
  font-family: ${props => props.theme.fontFamily};
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.27px;
  margin-bottom: 30px;
`;

HeroLabel.defaultProps = {
  theme: {
    color: colors.basic.WHITE,
    fontFamily: fonts.SANS_SERIF,
  },
};

export const HeroHeading = styled.h2`
  color: ${props => props.theme.color};
  font-family: ${props => props.theme.fontFamily};
  font-size: 38px;
  font-weight: 200;
  letter-spacing: -1px;
  line-height: 40px;
  margin: 20px auto;
`;

HeroHeading.defaultProps = {
  theme: {
    color: colors.basic.WHITE,
    fontFamily: fonts.SERIF,
  },
};

export const HeroBlockTextLink = styled.a`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_2};
  color: ${props => props.theme.color};
  font-family: ${props => props.theme.fontFamily};
  font-size: 20px;
  margin: 40px auto;
  padding-bottom: 5px;
  text-decoration: none;
  transition: border-bottom 500ms;
  &:hover {
    border-bottom: 1px solid ${colors.accent.CIVIL_BLUE};
    color: ${props => props.theme.color};
  }
`;

HeroBlockTextLink.defaultProps = {
  theme: {
    color: colors.basic.WHITE,
    fontFamily: fonts.SERIF,
  },
};

export const HeroSmallText = styled.small`
  color: ${props => props.theme.color};
  display: block;
  font-family: ${props => props.theme.fontFamily};
  font-size: 14px;
  line-height: 17px;
  margin: 20px auto;
`;

HeroSmallText.defaultProps = {
  theme: {
    color: colors.basic.WHITE,
    fontFamily: fonts.SANS_SERIF,
  },
};

export class Hero extends React.Component {
  public render(): JSX.Element {
    return (
      <HeroOuter>
        <HeroInner>{this.props.children}</HeroInner>
      </HeroOuter>
    );
  }
}
