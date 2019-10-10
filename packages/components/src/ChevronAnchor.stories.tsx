import { storiesOf } from "@storybook/react";
import * as React from "react";
import { ChevronAnchor } from "./ChevronAnchor";
import { ChevronAnchorLeft } from "./ChevronAnchorLeft";
import { colors } from "@joincivil/elements";
import styled from "styled-components";

const ThemedContainer = styled.div`
  a {
    color: ${colors.primary.CIVIL_BLUE_1};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

storiesOf("Pattern Library / Typography / Chevron Anchor", module)
  .add("Default", () => {
    return <ChevronAnchor href="#">Check this out</ChevronAnchor>;
  })
  .add("Civil Themed", () => {
    return (
      <ThemedContainer>
        <ChevronAnchor href="#">Check this out</ChevronAnchor>
      </ThemedContainer>
    );
  })
  .add("Civil Themed, Left", () => {
    return (
      <ThemedContainer>
        <ChevronAnchorLeft href="#">Go back to that thing</ChevronAnchorLeft>
      </ThemedContainer>
    );
  });
