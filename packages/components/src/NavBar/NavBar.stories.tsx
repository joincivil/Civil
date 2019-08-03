import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import { NavBar } from "./NavBar";
import { NavErrorBar } from "./NavErrorBar";
import { NavUserAccount } from "./UserAccount";

const balance = "100,203";
const votingBalance = "1,200";
const userAccount = "0xd26114cd6ee289accf82350c8d8487fedb8a0c07";

const userAccountEl = (
  <NavUserAccount
    balance={balance}
    votingBalance={votingBalance}
    userEthAddress={userAccount}
    isUserDrawerOpen={false}
    toggleDrawer={() => console.log("toggle drawer")}
  />
);

storiesOf("Common / Nav / Nav Bar", module)
  .addDecorator(StoryRouter())
  .add("Global Nav", () => {
    return <NavBar userAccountEl={userAccountEl} />;
  })
  .add("Nav Error Bar", () => {
    return <NavErrorBar />;
  });
