import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Leaderboard } from "./Leaderboard";
import { ContributerCount } from "./ContributerCount";

const Container = styled.div`
  display: flex;
  width: 400px;
`;

const contributers = [
  { avatar: "https://picsum.photos/50", username: "violetnight13", amount: "$2.50" },
  { avatar: "https://picsum.photos/50", username: "CaryRay", amount: "$5.00" },
  { avatar: "https://picsum.photos/50", username: "ronburgundy", amount: "0.009214 ETH" },
];

storiesOf("Common / Leaderboard", module)
  .add("Leaderboard", () => {
    return (
      <Container>
        <Leaderboard label={"Recent Contributers"} contributers={contributers} />
      </Container>
    );
  })
  .add("Contributer Count", () => {
    return (
      <Container>
        <ContributerCount label={"contributers"} contributers={contributers} total={30} />
      </Container>
    );
  });
