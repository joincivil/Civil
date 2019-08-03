import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import { NavBar } from "./NavBar";
import { NavErrorBar } from "./NavErrorBar";
import { NavUserAccount } from "./UserAccount";

const balance = "100,203";
const votingBalance = "1,200";
const userAccount = "0xd26114cd6ee289accf82350c8d8487fedb8a0c07";
const userRevealVotesCount = 10;
const userClaimRewardsCount = 4;
const userChallengesStartedCount = 2;
const userChallengesVotedOnCount = 15;

const userAccountEl = (
  <NavUserAccount
    balance={balance}
    votingBalance={votingBalance}
    userEthAddress={userAccount}
    isUserDrawerOpen={false}
    toggleDrawer={() => console.log("toggle drawer")}
  />
);

/*
authenticationURL="#auth"
userRevealVotesCount={userRevealVotesCount}
userClaimRewardsCount={userClaimRewardsCount}
userChallengesStartedCount={userChallengesStartedCount}
userChallengesVotedOnCount={userChallengesVotedOnCount}
joinAsMemberUrl="#buy-tokens"
buyCvlUrl="#become-member"
applyURL="#apply"
useGraphQL={false}
onLoadingPrefToggled={() => {
  console.log("thinged");
}}
        */

storiesOf("Common / Nav / Nav Bar", module)
  .addDecorator(StoryRouter())
  .add("Global Nav", () => {
    return <NavBar userAccountEl={<>User Account</>} />;
  })
  .add("Nav Error Bar", () => {
    return <NavErrorBar />;
  });
