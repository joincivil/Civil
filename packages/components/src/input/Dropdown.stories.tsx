import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Dropdown, DropdownGroup, DropdownItem } from "./Dropdown";

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
