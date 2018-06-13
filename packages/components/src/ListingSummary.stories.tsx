import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import StoryRouter from "storybook-react-router";
import { ListingSummaryComponent, ListingSummaryComponentProps } from "./ListingSummary";
import { ListingSummaryList } from "./ListingSummaryList";

const StyledDiv = styled.div`
  display: flex;
  width: 600px;
`;

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
  .add("Card Grid", () => {
    const newsroom = newsrooms[0];

    return (
      <Container>
        <ListingSummaryList listings={newsrooms} />
      </Container>
    );
  });
