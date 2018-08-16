import * as React from "react";
import { Button, buttonSizes } from "../Button";
import { HeroLabel, HeroHeading, HeroBlockTextLink, HeroSmallText } from "./styledComponents";
import { homepageHeroText } from "./constants";

export interface HomepageHeroProps {
  textUrl: string;
  buttonUrl: string;
  minDeposit: string;
}

export class HomepageHero extends React.Component<HomepageHeroProps> {
  public render(): JSX.Element {
    return (
      <>
        <HeroLabel>{homepageHeroText.LABEL}</HeroLabel>
        <HeroHeading>{homepageHeroText.HEADING}</HeroHeading>
        <HeroBlockTextLink href={this.props.textUrl}>{homepageHeroText.BLOCK_TEXT_LINK}</HeroBlockTextLink>
        <Button size={buttonSizes.MEDIUM} to={this.props.buttonUrl}>
          {homepageHeroText.BUTTON}
        </Button>
        <HeroSmallText>
          {this.props.minDeposit}
          {homepageHeroText.SMALL}
        </HeroSmallText>
      </>
    );
  }
}
