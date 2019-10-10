import { storiesOf } from "@storybook/react";
import * as React from "react";
import Web3HttpProvider from "web3-providers-http";
import apolloStorybookDecorator from "apollo-storybook-react";
import styled from "styled-components";
import { EthSignedMessage } from "@joincivil/typescript-types";
import { AccountEthAuth } from "../";
import { CivilContext, buildCivilContext } from "../../context";
import Web3 from "web3";

export const Container = styled.div`
  align-items: center;
  diplay: flex;
  justifiy-content: center;
  width: 100%;
  max-width: 720px;
`;

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

const web3Provider = new Web3HttpProvider("http://localhost:8033");
const web3 = new Web3(web3Provider);
const civilContext = buildCivilContext({ web3, featureFlags: [], config: { DEFAULT_ETHEREUM_NETWORK: 4 } });

storiesOf("Common / Auth / ETH", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("AccountEthAuth Component", () => {
    return (
      <CivilContext.Provider value={civilContext}>
        <Container>
          <AccountEthAuth
            civil={civilContext.civil!}
            onAuthenticated={() => {
              alert("authenticated successfully");
            }}
          />
        </Container>
      </CivilContext.Provider>
    );
  });
