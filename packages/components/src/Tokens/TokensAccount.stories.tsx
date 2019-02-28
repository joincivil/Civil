import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { UserTokenAccountSignup } from "./TokensAccountSignup";
import { UserTokenAccountVerify } from "./TokensAccountVerify";
import { UserTokenAccountBuy } from "./TokensAccountBuy";

const onClickFunc = () => {
  console.log("clicked!");
};

const typeDefs = `
  type Query {
    storefrontEthPrice: Float
    storefrontCvlPrice: Float
    storefrontCvlQuoteUsd(usdToSpend: Float!): Float
  }

  schema {
    query: Query
  }
`;

const mocks = {
  Query: () => {
    return {
      storefrontEthPrice: () => {
        return 102.98;
      },
      storefrontCvlPrice: () => {
        return 0.2;
      },
      storefrontCvlQuoteUsd: () => {
        return 500.48635;
      },
    };
  },
};

export interface UserTokenAccountProgressProps {
  userAccount: string;
}

storiesOf("User Token Account", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .addDecorator(StoryRouter())
  .add("Signup Section", () => {
    return <UserTokenAccountSignup step={"active"} user={{}} signupPath="/auth/signup" addWalletPath="/auth/wallet" />;
  })
  .add("Tutorial Verify", () => {
    return <UserTokenAccountVerify step={"active"} open={false} handleClose={onClickFunc} handleOpen={onClickFunc} />;
  })
  .add("Buy Section", () => {
    return (
      <UserTokenAccountBuy
        step={"active"}
        network={"4"}
        foundationAddress={"0x..."}
        faqUrl={"https://cvlconsensys.zendesk.com/hc/en-us"}
        onBuyComplete={onClickFunc}
      />
    );
  });
