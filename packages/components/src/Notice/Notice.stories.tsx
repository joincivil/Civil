import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Notice, NoticeTypes } from "./index";

storiesOf("Notice", module)
  .add("Info", () => {
    return <Notice type={NoticeTypes.INFO}>This is an info notice</Notice>;
  })
  .add("Error", () => {
    return <Notice type={NoticeTypes.ERROR}>This is an error notice</Notice>;
  });
