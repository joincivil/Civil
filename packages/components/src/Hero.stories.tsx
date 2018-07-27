import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import { Hero, HeroOuter, HeroLabel, HeroHeading, HeroBlockTextLink, HeroSmallText } from "./Hero";
import { Button, buttonSizes } from "./Button";
import { colors } from "./styleConstants";

HeroOuter.defaultProps = {
    backgroundColor: colors.primary.BLACK,
    backgroundImg: "url('http://placehold.it/3000x800')",
  },
};

storiesOf("Hero", module)
  .addDecorator(StoryRouter())
  .add("Listings", () => {
    return (
      <Hero>
        <HeroLabel>Civil Registry</HeroLabel>
        <HeroHeading>
          The Civil Registry is a whitelist of community-approved newsrooms that have publishing rights on Civil.
        </HeroHeading>
        <HeroBlockTextLink href="/home">Learn how to participate in our governance</HeroBlockTextLink>
        <Button size={buttonSizes.MEDIUM} to="/home">
          APPLY TO JOIN REGISTRY
        </Button>
        <HeroSmallText>1,000 CVL required to apply</HeroSmallText>
      </Hero>
    );
  });
