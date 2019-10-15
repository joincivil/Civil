import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Contributors } from "./Contributors";
import { ContributorCount } from "./ContributorCount";

const Container = styled.div`
  width: 400px;
`;

const contributors = [
  {
    usdEquivalent: 2.5,
    payerChannel: {
      handle: "violetnight13",
      tiny72AvatarDataUrl: "https://picsum.photos/50",
    },
  },
  {
    usdEquivalent: 3,
    payerChannel: {
      handle: "CaryRay",
      tiny72AvatarDataUrl: "https://picsum.photos/50",
    },
  },
  {
    usdEquivalent: 5,
    payerChannel: {
      handle: "ronburgundy",
      tiny72AvatarDataUrl: "https://picsum.photos/50",
    },
  },
];

storiesOf("Common / Contributors", module)
  .add("Contributors", () => {
    return (
      <Container>
        <Contributors label={"Recent Contributors"} sortedContributors={contributors} />
      </Container>
    );
  })
  .add("Contributor Count", () => {
    return (
      <Container>
        <ContributorCount displayedContributors={contributors} totalContributors={30} />
      </Container>
    );
  });
