import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import { Hero, HeroLabel, HeroHeading, HeroBlockTextLink, HeroSmall, HeroButton } from "./Hero";
import { buttonSizes } from "./Button";
import { colors, fonts } from "./styleConstants";

storiesOf("Hero", module)
  .addDecorator(StoryRouter())
  .add("Listings Hero", () => {
    
  return (
    <Hero backgroundColor={colors.basic.WHITE}>
      <HeroLabel>Civil Registry</HeroLabel>
      <HeroHeading>
        The Civil Registry is a whitelist of community-approved newsrooms that have publishing rights on Civil.
      </HeroHeading>
      <HeroBlockTextLink href="/home">Learn how to participate in our governance</HeroBlockTextLink>
      <HeroButton size={buttonSizes.MEDIUM} to="/home">APPLY TO JOIN REGISTRY</HeroButton>
      <HeroSmall>1,000 CVL required to apply</HeroSmall>
    </Hero>
  );
});
