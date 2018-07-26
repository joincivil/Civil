import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Tabs } from "./Tabs";
import { Tab, TabComponentProps } from "./Tab";
import styled from "styled-components";
import { colors, fonts } from "./styleConstants";

const ListingsNavTabs = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  height: 76px;
  margin: 0 auto 50px;
  width: 100%;
  & > ul {
    justify-content: center;
  }
`;

const ListingsNavTab = styled.li`
  border-bottom: ${(props: TabComponentProps) =>
    props.isActive ? "8px solid " + colors.accent.CIVIL_BLUE : "8px solid transparent"};
  color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_BLUE : colors.accent.CIVIL_GRAY_2)};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 19px;
  font-weight: 800;
  margin: 39px 40px 0 0;
  padding: 0 0 10px;
  &:last-of-type {
    margin: 39px 0 0 0;
  }
  &:hover {
    border-bottom: ${(props: TabComponentProps) =>
      props.isActive ? "8px solid " + colors.accent.CIVIL_BLUE : "8px solid " + colors.accent.CIVIL_GRAY_2};
  }
`;

const ListingsSubnavTabs = styled.div`
  margin: 30px auto 50px;
  width: 100%;
`;

const ListingsSubnavTab = styled.li`
  background-color: ${(props: TabComponentProps) =>
    props.isActive ? colors.accent.CIVIL_BLUE_VERY_FADED : "transparent"};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-right: none;
  color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_BLUE : colors.primary.BLACK)};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  padding: 20px 44px;
  &:last-of-type {
    border-right: 1px solid ${colors.accent.CIVIL_GRAY_4};
  }
  &:hover {
    background-color: ${colors.accent.CIVIL_BLUE_VERY_FADED};
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

const ListingsPillTabs = styled.div`
  margin: 0 auto 50px;
  max-width: 1200px;
  width: 100%;
`;

const ListingsPillTab = styled.li`
  background-color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_GRAY_4 : "transparent")};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 23px;
  color: ${colors.primary.BLACK};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  letter-spacing: -0.12px;
  list-style: none;
  margin-right: 10px;
  padding: 8px 15px;
  &:hover {
    background-color: ${colors.accent.CIVIL_GRAY_4};
  }
`;

const ListingTab = styled.li`
  border-bottom: 2px solid transparent;
  color: ${colors.accent.CIVIL_GRAY_2};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  letter-spacing: -0.12px;
  margin-right: 15px;
  padding: 10px 0 15px;
  text-align: center;
  text-decoration: none;
  transition: background-color 500ms, border 500ms, color 500ms;
  &:hover {
    border-bottom: 2px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.primary.BLACK};
  }
  &.active {
    border-bottom: 2px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.primary.BLACK};
  }
`;

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
  .add("Listings Nav Tabs", () => {
    return (
      <Tabs TabsNavComponent={ListingsNavTabs} TabComponent={ListingsNavTab}>
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
  .add("Listings Subnav Tabs", () => {
    return (
      <Tabs TabsNavComponent={ListingsSubnavTabs} TabComponent={ListingsSubnavTab}>
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
  .add("Listings Pill Tabs", () => {
    return (
      <Tabs TabsNavComponent={ListingsPillTabs} TabComponent={ListingsPillTab}>
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
  .add("Listing Nav Tabs", () => {
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
