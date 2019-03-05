import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import { DashboardTransferTokenForm } from "./DashboardTransferTokenForm";
import { DashboardTutorialWarning } from "./DashboardTutorialWarning";

storiesOf("Dashboard", module)
  .addDecorator(StoryRouter())
  .add("Transfer Token Form", () => {
    return <DashboardTransferTokenForm cvlAvailableBalance={"500.005"} cvlVotingBalance={"7001.1234"} />;
  })
  .add("take tutorial", () => {
    return <DashboardTutorialWarning />;
  });
