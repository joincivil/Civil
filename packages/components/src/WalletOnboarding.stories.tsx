import { storiesOf } from "@storybook/react";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { Civil } from "@joincivil/core";
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

let civil: Civil | undefined;
try {
  civil = new Civil();
} catch (error) {
  civil = undefined;
}

storiesOf("Wallet Onboarding", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("No Provider", () => {
    return <WalletOnboarding enable={() => {}} noProvider={true} />;
  })
  .add("Not Enabled", () => {
    return <WalletOnboarding enable={() => {}} notEnabled={true} />;
  })
  .add("Locked", () => {
    return <WalletOnboarding enable={() => {}} walletLocked={true} />;
  })
  .add("Wrong Network", () => {
    return <WalletOnboarding enable={() => {}} wrongNetwork={true} requiredNetworkNiceName="Main Ethereum Network" />;
  })
  .add("Save address to CMS profile", () => {
    return (
      <WalletOnboarding
        enable={() => {}}
        metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
        saveAddressToProfile={async () => {}}
      />
    );
  })
  .add("CMS profile vs. MetaMask address mismatch", () => {
    return (
      <WalletOnboarding
        enable={() => {}}
        metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
        profileWalletAddress="0x123abc00000000000000000000000000000x123abc"
        saveAddressToProfile={async () => {}}
      />
    );
  })
  .add("Save wallet to Civil account", () => {
    return (
      <>
        <WalletOnboarding
          enable={() => {}}
          metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
          civil={civil}
          requireAuth={true}
        />
      </>
    );
  })
  .add("Civil account vs. MetaMask address mismatch", () => {
    return (
      <>
        <WalletOnboarding
          enable={() => {}}
          metamaskWalletAddress="0xabc1230000000000000000000000000000abc123"
          profileWalletAddress="0x123abc00000000000000000000000000000x123abc"
          civil={civil}
          requireAuth={true}
        />
      </>
    );
  })
  .add("Connected", () => {
    return <WalletOnboarding enable={() => {}} metamaskWalletAddress="0xabc1230000000000000000000000000000abc123" />;
  });
