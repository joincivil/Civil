import { storiesOf } from "@storybook/react";
import * as React from "react";
import { CopyURL } from "./CopyURL";

storiesOf("Common / Copy", module).add("Copy URL", () => {
  return <CopyURL copyText={"Copy the URL to open in your own wallet"} />;
});
