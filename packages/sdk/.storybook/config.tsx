import * as React from "react";
import { configure, addDecorator } from "@storybook/react";
import { CivilProvider } from "../src/react/CivilProvider";

// automatically import all files ending in *.stories.js
const req = require.context("../src", true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(storyFn => (
  <>
    <CivilProvider>{storyFn()}</CivilProvider>
  </>
));

configure(loadStories, module);
