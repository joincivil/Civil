import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Tabs } from "./Tabs";
import { Tab, TabComponentProps } from "./Tab";
import styled from "styled-components";

const StyledLi = styled.li`
  background-color: whitesmoke;
  padding: 3px 0 18px;
  margin-bottom: 0;
  width: 75px;
  box-sizing: border-box;
  text-align: center;
  font-weight: 600;
  font-family: ${props => props.theme.sanserifFont};
  border-bottom: ${(props: TabComponentProps) => (props.isActive ? "3px solid red" : "none")};
`;

storiesOf("tabs", module)
  .add("tabs", () => {
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
  .add("with costum tab comonent", () => {
    return (
      <Tabs TabComponent={StyledLi}>
        <Tab title="Index">
          <p>Some Content</p>
        </Tab>
        <Tab title="Sign">
          <p>Some other Content</p>
        </Tab>
      </Tabs>
    );
  });
