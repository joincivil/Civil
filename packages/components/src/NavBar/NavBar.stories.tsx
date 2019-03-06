import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import { NavBar } from "./NavBar";
import { NavErrorBar } from "./NavErrorBar";

const balance = "100,203";
const votingBalance = "1,200";
const userAccount = "0xd26114cd6ee289accf82350c8d8487fedb8a0c07";
const userRevealVotesCount = 10;
const userClaimRewardsCount = 4;
const userChallengesStartedCount = 2;
const userChallengesVotedOnCount = 15;

storiesOf("Nav Bar", module)
  .addDecorator(StoryRouter())
  .add("Global Nav", () => {
    return (
      <NavBar
        balance={balance}
        votingBalance={votingBalance}
        userEthAddress={userAccount}
        authenticationURL="#auth"
        userRevealVotesCount={userRevealVotesCount}
        userClaimRewardsCount={userClaimRewardsCount}
        userChallengesStartedCount={userChallengesStartedCount}
        userChallengesVotedOnCount={userChallengesVotedOnCount}
        buyCvlUrl="#buy-tokens"
        applyURL="#apply"
        useGraphQL={false}
        onLoadingPrefToggled={() => {
          console.log("thinged");
        }}
      />
    );
  })
  .add("Nav Error Bar", () => {
    return <NavErrorBar />;
  });
