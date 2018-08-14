import * as React from "react";
import { Button, buttonSizes } from "../Button";
import { HeroLabel, HeroHeading, HeroBlockTextLink, HeroSmallText } from "./styledComponents";

export interface HomepageHeroProps {
  textUrl: string;
  buttonUrl: string;
}

export class HomepageHero extends React.Component<HomepageHeroProps> {
  public render(): JSX.Element {
    return (
      <>
        <HeroLabel>Civil Registry</HeroLabel>
        <HeroHeading>
          The Civil Registry is a whitelist of community-approved newsrooms that have publishing rights on Civil.
        </HeroHeading>
        <HeroBlockTextLink href="{this.props.textUrl}">Learn how to participate in our governance</HeroBlockTextLink>
        <Button size={buttonSizes.MEDIUM} to="{this.props.buttonUrl}">
          APPLY TO JOIN REGISTRY
        </Button>
        <HeroSmallText>1,000 CVL required to apply</HeroSmallText>
      </>
    );
  }
}
