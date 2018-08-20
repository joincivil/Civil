import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Tabs } from "./Tabs";
import { Tab } from "./Tab";
import {
  StyledTabNav,
  StyledTabLarge,
  StyledSquarePillTabNav,
  StyledSquarePillTab,
  StyledRoundPillTabNav,
  StyledRoundPillTab,
  StyledTab,
} from "./TabsStyled";
import { ApprovedNewsroomsTabText, ApplicationsInProgressTabText, RejectedNewsroomsTabText } from "./textComponents";

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
  .add("Styled Large Tab", () => {
    return (
      <Tabs TabsNavComponent={StyledTabNav} TabComponent={StyledTabLarge}>
        <Tab title={<ApprovedNewsroomsTabText />}>
          <p>Some Content</p>
        </Tab>
        <Tab title={<ApplicationsInProgressTabText />}>
          <p>Some other Content</p>
        </Tab>
        <Tab title={<RejectedNewsroomsTabText />}>
          <p>Some other Content</p>
        </Tab>
      </Tabs>
    );
  })
  .add("Square Pill Tab", () => {
    return (
      <Tabs TabsNavComponent={StyledSquarePillTabNav} TabComponent={StyledSquarePillTab}>
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
  .add("Round Pill Tab", () => {
    return (
      <Tabs TabsNavComponent={StyledRoundPillTabNav} TabComponent={StyledRoundPillTab}>
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
  .add("Styled Tab", () => {
    return (
      <Tabs TabComponent={StyledTab}>
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
