import * as React from "react";
import { storiesOf } from "@storybook/react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { BoostCard } from "./BoostCard";

const boost = {
  id: "87d0fe80-505f-4c1c-8a09-db7e20cb1045",
  address: "0x...",
  title: "Help The Colorado Sun stage a panel discussion about the impact of the opioid crisis on Colorado",
  dateEnd: "2019-07-25T12:00:00Z",
  why:
    "The opioid crisis is breaking hearts in Colorado — and that’s forcing doctors to make tough choices. The Colorado Sun is creating a panel discussion with doctors, residents, and families to dive deeper and learn more about the impact of the opioid crisis. With your help, we can bring new resources and help victims by having people discuss their experieences and plan on better ways to help this issue.",
  what:
    "We’ll be setting up a free panel discussion for the community. We’ll invite families, people, and anyone who would like to join in this panel discussion. The event will be open to all on a first come basis with invites being sent out. This panel will be a 1 to 2 hour discussion in our local theater.",
  about:
    "The Colorado Sun is a journalist-owned, ad-free news outlet based in Denver but which strives to cover all of Colorado so that our state — our community — can better understand itself.",
  items: [
    { item: "Venue deposit", cost: 100 },
    { item: "Flyers and materials", cost: 100 },
    { item: "Stage equipment", cost: 25 },
  ],
  channelID: "0xabc123",
  goalAmount: 325,
  paymentsTotal: 25,
  channel: {
    id: "",
    channelType: "",
    isStripeConnected: true,
    stripeAccountID: "acct_id_00000",
    newsroom: {
      contractAddress: "0xabc123",
    },
  },
};

const typeDefs = `
  type Query {
    name: String!
    url: String!
  }
  schema {
    query: Query
  }
`;

const mocks = {
  Query: () => {
    return {
      name: "Block Club Chicago",
      url: "https://blockclubchicago.org/",
    };
  },
};

const newsroomData = {
  name: "Block Club Chicago",
  url: "https://blockclubchicago.org/",
  charter: {},
} as any;

const onClickFunc = () => {
  console.log("clicked!");
};

storiesOf("Boosts", module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    }),
  )
  .add("Card List View", () => {
    return (
      <BoostCard
        boostOwner={true}
        newsroomData={newsroomData}
        boostData={boost}
        open={false}
        boostId={boost.id}
        handlePayments={onClickFunc}
        paymentSuccess={false}
      />
    );
  })
  .add("Card Full View", () => {
    return (
      <BoostCard
        boostData={boost}
        newsroomData={newsroomData}
        boostOwner={true}
        open={true}
        boostId={boost.id}
        handlePayments={onClickFunc}
        paymentSuccess={false}
      />
    );
  });
