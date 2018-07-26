import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Tabs } from "./Tabs";
import { Tab } from "./Tab";
import {
  ListingsTabNav,
  ListingsTab,
  ListingsInProgressTabNav,
  ListingsInProgressTab,
  MyActivityTabNav,
  MyActivityTab,
  ListingTab,
} from "./TabsStyled";

storiesOf("Tabs", module)
  .add("Default Tabs", () => {
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
  })
  .add("Listings Tabs", () => {
    return (
      <Tabs TabsNavComponent={ListingsTabNav} TabComponent={ListingsTab}>
        <Tab title={"Approved Newsrooms"}>
          <p>Some Content</p>
        </Tab>
        <Tab title="Applicaitons In Progress">
          <p>Some other Content</p>
        </Tab>
        <Tab title="Rejected Newsrooms">
          <p>Some other Content</p>
        </Tab>
      </Tabs>
    );
  })
  .add("Listings In Progress Tab", () => {
    return (
      <Tabs TabsNavComponent={ListingsInProgressTabNav} TabComponent={ListingsInProgressTab}>
        <Tab title="New Applications">
          <p>Some Content</p>
        </Tab>
        <Tab title="Under Challenge">
          <p>Some other Content</p>
        </Tab>
        <Tab title="Appeal to Council">
          <p>Some other Content</p>
        </Tab>
        <Tab title="Challenge Council Appeal">
          <p>Some other Content</p>
        </Tab>
      </Tabs>
    );
  })
  .add("My Activity Tabs", () => {
    return (
      <Tabs TabsNavComponent={MyActivityTabNav} TabComponent={MyActivityTab}>
        <Tab title="All">
          <p>Some Content</p>
        </Tab>
        <Tab title="Accepting Votes">
          <p>Some other Content</p>
        </Tab>
        <Tab title="Verifying Votes">
          <p>Some other Content</p>
        </Tab>
        <Tab title="Request Appeal">
          <p>Some other Content</p>
        </Tab>
        <Tab title="Ready to Complete">
          <p>Some other Content</p>
        </Tab>
      </Tabs>
    );
  })
  .add("Listing Tabs", () => {
    return (
      <Tabs TabComponent={ListingTab}>
        <Tab title="About">
          <p>Some Content</p>
        </Tab>
        <Tab title="Discussions">
          <p>Some other Content</p>
        </Tab>
        <Tab title="History">
          <p>Some other Content</p>
        </Tab>
      </Tabs>
    );
  });
