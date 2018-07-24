import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Tabs } from "./Tabs";
import { Tab } from "./Tab";

storiesOf("tabs", module).add("tabs", () => {
  return (
    <Tabs>
      <Tab title="Index">
        <p>Some Content</p>
      </Tab>
      <Tab title="Sign">
        <p>Some other Content</p>
      </Tab>
    </Tabs>
  );
});
