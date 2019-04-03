import { storiesOf } from "@storybook/react";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { EthSignedMessage } from "@joincivil/typescript-types";
import { WalletOnboarding } from ".";

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

storiesOf("Wallet Onboarding", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("No Provider", () => {
    return <WalletOnboarding enable={() => undefined} noProvider={true} />;
  })
  .add("Not Enabled", () => {
    return <WalletOnboarding enable={() => undefined} notEnabled={true} />;
  })
  .add("Locked", () => {
    return <WalletOnboarding enable={() => undefined} walletLocked={true} />;
  })
  .add("Wrong Network", () => {
    return (
      <WalletOnboarding enable={() => undefined} wrongNetwork={true} requiredNetworkNiceName="Main Ethereum Network" />
    );
  })
  .add("Save address to CMS profile", () => {
    return (
      <WalletOnboarding
        enable={() => undefined}
        metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
        saveAddressToProfile={async () => undefined}
      />
    );
  })
  .add("CMS profile vs. MetaMask address mismatch", () => {
    return (
      <WalletOnboarding
        enable={() => undefined}
        metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
        profileWalletAddress="0x123abc00000000000000000000000000000x123abc"
        saveAddressToProfile={async () => undefined}
      />
    );
  })
  .add("Connected", () => {
    return (
      <WalletOnboarding enable={() => undefined} metamaskWalletAddress="0xabc1230000000000000000000000000000abc123" />
    );
  });
