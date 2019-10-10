import * as React from "react";
import { storiesOf } from "@storybook/react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { BoostPayments } from "./BoostPayments";

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

const handlePaymentSuccess = () => {
  console.log("success!");
};

storiesOf("Boosts", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("Payments", () => {
    return (
      <>
        <BoostPayments
          boostId={"87d0fe80-505f-4c1c-8a09-db7e20cb1045"}
          title={"Help The Colorado Sun stage a panel discussion about the impact of the opioid crisis on Colorado"}
          newsroomName={"The Colorado Sun"}
          paymentAddr={"0x"}
          handleBackToListing={handlePaymentSuccess}
          handlePaymentSuccess={handlePaymentSuccess}
          isStripeConnected={true}
          history={{}}
        />
      </>
    );
  });
