import { storiesOf } from "@storybook/react";
import styled from "styled-components";
import * as React from "react";
import { Notice, NoticeTypes } from "./index";

const Container = styled.div`
  > div {
    margin: 20px;
  }
`;

storiesOf("Pattern Library / Notices", module)
  .add("Notice - All types", () => (
    <Container>
      <Notice type={NoticeTypes.INFO}>This is an info notice</Notice>
      <Notice type={NoticeTypes.ERROR}>This is an error notice</Notice>
      <Notice type={NoticeTypes.ALERT}>This is an alert notice</Notice>
      <Notice type={NoticeTypes.ATTENTION}>This is an attention notice</Notice>
    </Container>
  ))
  .add("Info", () => {
    return <Notice type={NoticeTypes.INFO}>This is an info notice</Notice>;
  })
  .add("Error", () => {
    return <Notice type={NoticeTypes.ERROR}>This is an error notice</Notice>;
  })
  .add("Alert", () => {
    return <Notice type={NoticeTypes.ALERT}>This is an alert notice</Notice>;
  })
  .add("Attention", () => {
    return <Notice type={NoticeTypes.ATTENTION}>This is an attention notice</Notice>;
  });
