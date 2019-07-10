import { storiesOf } from "@storybook/react";
import * as React from "react";
import { CopyURL } from "./CopyURL";
import styled from "styled-components";

const Container = styled.div`
  width: 300px;
`;

storiesOf("Common / Copy", module).add("Copy URL", () => {
  return (
    <Container>
      <CopyURL copyText={"Copy the URL to open in your own wallet"} />
    </Container>
  );
});
