import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import { BrowserCompatible } from "./BrowserCompatible";

storiesOf("Common / Browser Compatible Message", module)
  .addDecorator(StoryRouter())
  .add("Browser Compatible", () => {
    return <BrowserCompatible />;
  });
