import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import styled from "styled-components";
import { Tab, BasicTab, PillTab, BoxTab, BorderBottomTab, Count } from "./Tab";

const StyledDiv = styled.div`
  display: flex;
`;

const Container: React.StatelessComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("Tabs", module)
  .addDecorator(StoryRouter())
  .add("Registry Main Tabs", () => {
    return (
      <Container>
        <BorderBottomTab tabText="Approved Newsrooms"></BorderBottomTab>
        <BorderBottomTab tabText="Applicaitons In Progress"></BorderBottomTab>
        <BorderBottomTab tabText="Rejected Newsrooms"></BorderBottomTab>
      </Container>
    );
  })
  .add("Registry Sub Tabs", () => {
    return (
      <Container>
        <BoxTab tabText="New Applications"></BoxTab>
        <BoxTab tabText="Under Challenge"></BoxTab>
        <BoxTab tabText="Appeal to Council"></BoxTab>
        <BoxTab tabText="Challenge Council Appeal"></BoxTab>
      </Container>
    );
  })
  .add("Registry Pill Tabs", () => {
    return (
      <Container>
        <PillTab tabText="All"></PillTab>
        <PillTab tabText="Accepting Votes"></PillTab>
        <PillTab tabText="Verifying Votes"></PillTab>
        <PillTab tabText="Request Appeal"></PillTab>
        <PillTab tabText="Ready to Complete"></PillTab>
      </Container>
    );
  })
  .add("Newsroom Tabs", () => {
    return (
      <Container>
        <BasicTab tabText="About"></BasicTab>
        <BasicTab tabText="Discussions"></BasicTab>
        <BasicTab tabText="History"></BasicTab>
      </Container>
    );
  });
