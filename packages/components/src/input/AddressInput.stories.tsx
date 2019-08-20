import { storiesOf } from "@storybook/react";
import * as React from "react";
import { AddressInput } from "./AddressInput";

storiesOf("Pattern Library / inputs / AddressInput", module)
  .add("valid", () => {
    return (
      <AddressInput
        address={"0x8c722b8ac728add7780a66017e8dadba530ee261"}
        onChange={(name: any, value: any) => undefined}
      />
    );
  })
  .add("invalid", () => {
    return <AddressInput address={"0x8c722b8ac728add7780a66017e"} onChange={(name: any, value: any) => undefined} />;
  });
