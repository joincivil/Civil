import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button, buttonSizes } from "../Button";
import {
  HeroOuter,
  HeroInner,
  HeroLabel,
  HeroHeading,
  HeroBlockTextLink,
  HeroSmallText,
} from "./styledComponents";
import * as heroImgFile from "./img-hero-listings.png";

export interface HeroProps {
  backgroundImage?: string;
}

export class HomepageHero extends React.Component<HeroProps> {
  public render(): JSX.Element {
    return (
      <HeroOuter backgroundImage={this.props.backgroundImage}>
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
