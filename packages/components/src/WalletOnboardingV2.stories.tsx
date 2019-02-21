import { storiesOf } from "@storybook/react";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { Civil } from "@joincivil/core";
import { EthSignedMessage } from "@joincivil/typescript-types";
import { WalletOnboardingV2 } from ".";

const typeDefs = `
  type User {
    ethAddress: String
  }

  type Query {
    currentUser: User
  }

  input UserSignatureInput {
    message: String!
    messageHash: String!
    signature: String!
    signer: String!
    r: String!
    s: String!
    v: String!
  }

  type Mutation {
    userSetEthAddress(
      input: UserSignatureInput!
    ): String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

const mocks = {
  Query: () => {
    return {
      currentUser: () => {
        return "ok";
      },
    };
  },
  Mutation: () => {
    return {
      userSetEthAddress: (sig: EthSignedMessage) => {
        return "ok";
      },
    };
  },
};

let civil: Civil | undefined;
try {
  civil = new Civil();
} catch (error) {
  civil = undefined;
}

storiesOf("Wallet Onboarding V2", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("No Provider", () => {
    return (
      <>
        <b>NOTE:</b> To see this state you must view this story with MetaMask disabled or from a browser without it
        installed.
        <WalletOnboardingV2 />;
      </>
    );
    // return <WalletOnboardingV2 noProvider={true} />;
  })
  .add("Not Enabled", () => {
    return (
      <>
        <b>NOTE:</b> To see this state you must view this story with metamask from a browser where you haven't enabled
        MetaMask for this domain, or if you already have, you can go into MetaMask settings, enable privacy mode, and
        hit Clear Privacy Data and refresh.
        <WalletOnboardingV2 />;
      </>
    );
  })
  .add("Locked", () => {
    return <WalletOnboardingV2 civil={civil} />;
  })
  .add("Wrong Network", () => {
    return <WalletOnboardingV2 wrongNetwork={true} requiredNetworkNiceName="Main Ethereum Network" />;
  })
  .add("Save address to Civil account", () => {
    return <WalletOnboardingV2 metamaskWalletAddress="0xabc1230000000000000000000000000000abc123" civil={civil} />;
  })
  .add("Civil account vs. MetaMask address mismatch", () => {
    return (
      <WalletOnboardingV2
        metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
        profileWalletAddress="0x123abc00000000000000000000000000000x123abc"
        civil={civil}
      />
    );
  })
  .add("Connected", () => {
    return (
      <WalletOnboardingV2
        metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
        profileWalletAddress="0xabc1230000000000000000000000000000abc123"
        civil={civil}
      />
    );
  });
