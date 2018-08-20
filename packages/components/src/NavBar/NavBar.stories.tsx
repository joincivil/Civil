import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import { NavBar } from "./NavBar";
import { NavErrorBar } from "./NavErrorBar";

const balance = "100,203";
const votingBalance = "1,200";
const userAccount = "0xd26114cd6ee289accf82350c8d8487fedb8a0c07";
const userChallengesVotedOnCount = "15";
const userChallengesStartedCount = "2";
const ethConversion = "400 USD to .002 ETH";

storiesOf("Nav Bar", module)
  .addDecorator(StoryRouter())
  .add("Global Nav", () => {
    return (
      <NavBar
        balance={balance}
        votingBalance={votingBalance}
        userAccount={userAccount}
        userChallengesVotedOnCount={userChallengesVotedOnCount}
        userChallengesStartedCount={userChallengesStartedCount}
        ethConversion={ethConversion}
        buyCvlUrl="https://civil.co/cvl/"
      />
    );
  })
  .add("Nav Error Bar", () => {
    return <NavErrorBar />;
  });
