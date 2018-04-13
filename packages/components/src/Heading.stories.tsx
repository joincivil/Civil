import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Heading, SubHeading, SectionHeading, BlockHeading } from "./Heading";

const StyledDiv = styled.div`
  display: flex;
  width: 200px;
`;

const Container: React.StatelessComponent<{}> = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Headings", module).add("Headings", () => {
  return (
    <Container>
      <Heading>Heading</Heading>
      <SubHeading>Sub Heading</SubHeading>
      <SectionHeading>Section Heading</SectionHeading>
      <BlockHeading>Block Heading</BlockHeading>
    </Container>
  );
});
