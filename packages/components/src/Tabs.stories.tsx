import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import styled from "styled-components";
import { BasicTab, PillTab, BoxTab, BorderBottomTab } from "./Tab";

const StyledDiv = styled.div`
  display: flex;
`;

const Container: React.StatelessComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("Tabs", module)
  .addDecorator(StoryRouter())
  .add("Registry Main Tabs", () => {
    return (
      <Container>
        <BorderBottomTab tabText="Approved Newsrooms" />
        <BorderBottomTab tabText="Applicaitons In Progress" />
        <BorderBottomTab tabText="Rejected Newsrooms" />
      </Container>
    );
  })
  .add("Registry Sub Tabs", () => {
    return (
      <Container>
        <BoxTab tabText="New Applications" tabCount=" (0)" />
        <BoxTab tabText="Under Challenge" tabCount=" (5)" />
        <BoxTab tabText="Appeal to Council" tabCount=" (7)" />
        <BoxTab tabText="Challenge Council Appeal" tabCount=" (10)" />
      </Container>
    );
  })
  .add("Registry Pill Tabs", () => {
    return (
      <Container>
        <PillTab tabText="All" />
        <PillTab tabText="Accepting Votes" tabCount=" (0)" />
        <PillTab tabText="Verifying Votes" />
        <PillTab tabText="Request Appeal" />
        <PillTab tabText="Ready to Complete" />
      </Container>
    );
  })
  .add("Newsroom Tabs", () => {
    return (
      <Container>
        <BasicTab tabText="About" />
        <BasicTab tabText="Discussions" />
        <BasicTab tabText="History" />
      </Container>
    );
  });
