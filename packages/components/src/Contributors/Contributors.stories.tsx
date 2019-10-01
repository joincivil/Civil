import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Contributors } from "./Contributors";
import { ContributorCount } from "./ContributorCount";

const Container = styled.div`
  display: flex;
  width: 400px;
`;

const contributors = [
  { avatar: "https://picsum.photos/50", username: "violetnight13", amount: "$2.50" },
  { avatar: "https://picsum.photos/50", username: "CaryRay", amount: "$5.00" },
  { avatar: "https://picsum.photos/50", username: "ronburgundy", amount: "0.009214 ETH" },
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
