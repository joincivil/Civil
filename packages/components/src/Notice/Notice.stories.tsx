import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Notice, NoticeTypes } from "./index";

storiesOf("Notice", module)
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
