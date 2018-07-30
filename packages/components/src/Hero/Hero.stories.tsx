import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import { HomepageHero } from "./HomepageHero";

storiesOf("Hero", module)
  .addDecorator(StoryRouter())
  .add("Homepage", () => {
    return <HomepageHero />;
  });
