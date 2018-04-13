import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Dropdown, DropdownGroup, DropdownItem } from "./Dropdown";
import { TextInput } from "./Input";

const onChange = (name: string, value: any): any => {
  console.log("change: ", name, value);
  return;
};

class StateWrapper extends React.Component<{}, {}> {}

storiesOf("Dropdown", module).add("Dropdown", () => {
  return (
    <Dropdown position="left" target={<span>Click to Activate</span>}>
      <DropdownGroup>
        <DropdownItem>Account</DropdownItem>
        <DropdownItem>Help Center</DropdownItem>
        <DropdownItem>Sign Out</DropdownItem>
      </DropdownGroup>
    </Dropdown>
  );
});
