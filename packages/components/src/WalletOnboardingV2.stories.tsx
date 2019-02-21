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
    return <WalletOnboardingV2 enable={() => {}} noProvider={true} />;
  })
  .add("Not Enabled", () => {
    return <WalletOnboardingV2 enable={() => {}} notEnabled={true} />;
  })
  .add("Locked", () => {
    return <WalletOnboardingV2 enable={() => {}} walletLocked={true} />;
  })
  .add("Wrong Network", () => {
    return <WalletOnboardingV2 enable={() => {}} wrongNetwork={true} requiredNetworkNiceName="Main Ethereum Network" />;
  })
  .add("Save address to Civil account", () => {
    return (
      <WalletOnboardingV2
        enable={() => {}}
        metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
        civil={civil}
      />
    );
  })
  .add("Civil account vs. MetaMask address mismatch", () => {
    return (
      <WalletOnboardingV2
        enable={() => {}}
        metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
        profileWalletAddress="0x123abc00000000000000000000000000000x123abc"
        civil={civil}
      />
    );
  })
  .add("Connected", () => {
    // return <WalletOnboardingV2 enable={() => {}} walletLocked={true} onContinue={() => {}} metamaskWalletAddress="0xabc1230000000000000000000000000000abc123" />;
    return (
      <WalletOnboardingV2
        enable={() => {}}
        metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
        profileWalletAddress="0xabc1230000000000000000000000000000abc123"
      />
    );
  });
