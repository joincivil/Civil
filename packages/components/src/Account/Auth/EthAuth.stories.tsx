import { storiesOf } from "@storybook/react";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import styled, { StyledComponentClass } from "styled-components";
import { Civil } from "@joincivil/core";
import { EthSignedMessage } from "@joincivil/typescript-types";
import { CivilContext, ICivilContext, buildCivilContext } from "../../context";
import { AccountEthAuth } from "../";

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

let civil: Civil | undefined;
try {
  civil = new Civil();
} catch (error) {
  civil = undefined;
}
const civilContext = buildCivilContext(civil);

storiesOf("Common / Auth / ETH", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("AccountEthAuth Component", () => {
    return (
      <Container>
        <CivilContext.Provider value={civilContext}>
          <AccountEthAuth
            onAuthenticated={() => {
              alert("authenticated successfully");
            }}
          />
        </CivilContext.Provider>
      </Container>
    );
  });
