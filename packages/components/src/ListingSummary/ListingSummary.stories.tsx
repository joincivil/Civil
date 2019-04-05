import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import StoryRouter from "storybook-react-router";
import { ListingSummaryComponentProps } from "./types";
import { ListingSummaryComponent } from "./ListingSummary";
import { ListingSummaryRejectedComponent } from "./ListingSummaryRejected";
import { ListingSummaryList } from "./ListingSummaryList";

const StyledDiv = styled.div`
  display: flex;
  width: 600px;
`;

const totalVotes = "100000";
const votesFor = "73000";
const votesAgainst = "27000";
const percentFor = "73";
const percentAgainst = "27";
const didChallengeSucceed = false;

const newsroomData: ListingSummaryComponentProps[] = [
  {
    listingAddress: "0x0a",
    name: "Block Club Chicago",
    charter: {
      tagline:
        "Block Club Chicago is a nonprofit, neighborhood news organization dedicated to delivering reliable, nonpartisan and essential coverage of Chicago's diverse neighborhoods.",
    } as any,
  },
  {
    listingAddress: "0x0b",
    name: "Cannabis Wire",
    charter: {
      tagline:
        "Cannabis Wire is an independent publication covering the multi-billion dollar cannabis industry, focusing on investigation into the complexities that come with legaliation.",
    } as any,
  },
  {
    listingAddress: "0x0c",
    name: "Documented",
    charter: {
      tagline:
        "Documented covers New York City’s immigrants and the policies that affect their lives. We are an independent and nonpartisan publication.",
    } as any,
  },
  {
    listingAddress: "0x0d",
    name: "Block Club Chicago",
    charter: {
      tagline:
        "Block Club Chicago is a nonprofit, neighborhood news organization dedicated to delivering reliable, nonpartisan and essential coverage of Chicago's diverse neighborhoods.",
    } as any,
  },
  {
    listingAddress: "0x0e",
    name: "Cannabis Wire",
    charter: {
      tagline:
        "Cannabis Wire is an independent publication covering the multi-billion dollar cannabis industry, focusing on investigation into the complexities that come with legaliation.",
    } as any,
  },
  {
    listingAddress: "0x0f",
    name: "Documented",
    charter: {
      tagline:
        "Documented covers New York City’s immigrants and the policies that affect their lives. We are an independent and nonpartisan publication.",
    } as any,
  },
];

const newsrooms = newsroomData.map((newsroom: ListingSummaryComponentProps) => {
  const listingDetailURL = `/listing/${newsroom.listingAddress}`;
  return { ...newsroom, listingDetailURL };
});

const Container: React.FunctionComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Registry / Listing / Listing Summary", module)
  .addDecorator(StoryRouter())
  .add("Card", () => {
    const newsroom = newsrooms[0];

    return (
      <Container>
        <ListingSummaryComponent {...newsroom} />
      </Container>
    );
  })
  .add("Card Rejected", () => {
    const newsroom = newsrooms[0];

    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <ListingSummaryRejectedComponent
            {...newsroom}
            totalVotes={totalVotes}
            votesFor={votesAgainst}
            votesAgainst={votesFor}
            percentFor={percentAgainst}
            percentAgainst={percentFor}
            didChallengeSucceed={!didChallengeSucceed}
          />
        )}
      </Container>
    );
  })
  .add("Card Grid", () => {
    return (
      <Container>
        <ListingSummaryList listings={newsrooms} />
      </Container>
    );
  });
