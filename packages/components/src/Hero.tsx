import * as React from "react";
import styled from "styled-components";
import { Button, buttonSizes } from "./Button";

import { colors, fonts } from "./styleConstants";

const HeroOuter = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_1};
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

export const HeroLabel = styled.span`
  color: ${colors.basic.WHITE};
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.27px;
  margin-bottom: 30px;
`;

export const HeroHeading = styled.h2`
  color: ${colors.basic.WHITE};
  font-family: ${fonts.SERIF};
  font-weight: 200;
  font-size: 38px;
  letter-spacing: -1px;
  line-height: 40px;
  margin: 0 0 20px;
`;

export const HeroBlockTextLink = styled.a`
  background-color: transparent;
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
  }
`;

export const HeroSmall = styled.small`
  color: ${colors.basic.WHITE};
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 17px;
`;

export const HeroButton = Button.extend`
  margin-bottom: 15px;
`;

export interface HeroProps {
  backgroundImg?: string;
  backgroundColor?: string;
  textColor?: string;
}

export class Hero extends React.Component<HeroProps> {

  public render(): JSX.Element {
    return (
      <HeroOuter>
        <HeroInner>
          {this.props.children}
        </HeroInner>
      </HeroOuter>
    );
  }
};