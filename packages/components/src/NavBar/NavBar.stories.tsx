import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import { NavBar } from "./NavBar";
import { NavErrorBar } from "./NavErrorBar";
import { CivilContext, buildCivilContext } from "../context";

import Web3 from "web3";
import Web3HttpProvider from "web3-providers-http";

const balance = "100,203";
const votingBalance = "1,200";
const userAccount = "0xd26114cd6ee289accf82350c8d8487fedb8a0c07";
const userRevealVotesCount = 10;
const userClaimRewardsCount = 4;
const userChallengesStartedCount = 2;
const userChallengesVotedOnCount = 15;

const web3Provider = new Web3HttpProvider("http://localhost:8045");
const web3 = new Web3(web3Provider);
const civilContext = buildCivilContext({ web3, featureFlags: ["uniswap"], config: { DEFAULT_ETHEREUM_NETWORK: 4 } });

storiesOf("Common / Nav / Nav Bar", module)
  .addDecorator(StoryRouter())
  .add("Global Nav", () => {
    return (
      <CivilContext.Provider value={civilContext}>
        <NavBar
          balance={balance}
          votingBalance={votingBalance}
          userEthAddress={userAccount}
          authenticationURL="#auth"
          userRevealVotesCount={userRevealVotesCount}
          userClaimRewardsCount={userClaimRewardsCount}
          userChallengesStartedCount={userChallengesStartedCount}
          userChallengesVotedOnCount={userChallengesVotedOnCount}
          joinAsMemberUrl="#buy-tokens"
          buyCvlUrl="#become-member"
          applyURL="#apply"
          useGraphQL={false}
          onLogoutPressed={() => {
            console.log("onLogoutPressed");
          }}
          onLoginPressed={() => {
            console.log("onLoginPressed");
          }}
          onSignupPressed={() => {
            console.log("onSignupPressed");
          }}
          onModalDefocussed={() => {
            console.log("onModalDefocussed");
          }}
          onViewDashboardPressed={() => {
            console.log("onViewDashboardPressed");
          }}
        />
      </CivilContext.Provider>
    );
  })
  .add("Nav Error Bar", () => {
    return <NavErrorBar />;
  });
