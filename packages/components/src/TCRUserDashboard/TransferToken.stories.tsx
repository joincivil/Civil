import { storiesOf } from "@storybook/react";
import * as React from "react";
import { DashboardTransferTokenForm } from "./DashboardTransferTokenForm";

const onChange = () => {
  console.log("clicked!");
};

storiesOf("Dashboard", module).add("Transfer Token Form", () => {
  return <DashboardTransferTokenForm onChange={onChange} />;
});
