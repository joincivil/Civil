import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import StoryRouter from "storybook-react-router";
import { ListingSummaryComponent, ListingSummaryComponentProps } from "./ListingSummary";
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

const newsroomData: ListingSummaryComponentProps[] = [
  {
    address: "0x0a",
    name: "Block Club Chicago",
    description:
      "Block Club Chicago is a nonprofit, neighborhood news organization dedicated to delivering reliable, nonpartisan and essential coverage of Chicago's diverse neighborhoods.",
    owners: ["0x2e8c90676062144da5e5d4d5facb3388556c7ce4"],
  },
  {
    address: "0x0b",
    name: "Cannabis Wire",
    description:
      "Cannabis Wire is an independent publication covering the multi-billion dollar cannabis industry, focusing on investigation into the complexities that come with legaliation.",
    owners: ["0x0WN34"],
  },
  {
    address: "0x0c",
    name: "Documented",
    description:
      "Documented covers New York City’s immigrants and the policies that affect their lives. We are an independent and nonpartisan publication.",
    owners: ["0x0WN34"],
  },
  {
    address: "0x0d",
    name: "Block Club Chicago",
    description:
      "Block Club Chicago is a nonprofit, neighborhood news organization dedicated to delivering reliable, nonpartisan and essential coverage of Chicago's diverse neighborhoods.",
    owners: ["0x0WN34"],
  },
  {
    address: "0x0e",
    name: "Cannabis Wire",
    description:
      "Cannabis Wire is an independent publication covering the multi-billion dollar cannabis industry, focusing on investigation into the complexities that come with legaliation.",
    owners: ["0x0WN34"],
  },
  {
    address: "0x0f",
    name: "Documented",
    description:
      "Documented covers New York City’s immigrants and the policies that affect their lives. We are an independent and nonpartisan publication.",
    owners: ["0x0WN34"],
  },
];

const newsrooms = newsroomData.map((newsroom: ListingSummaryComponentProps) => {
  const listingDetailURL = `/listing/${newsroom.address}`;
  return { ...newsroom, listingDetailURL };
});

const Container: React.StatelessComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Listing Summary", module)
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
            votesFor={votesFor}
            votesAgainst={votesAgainst}
            percentFor={percentFor}
            percentAgainst={percentAgainst}
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
