import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import { UserTokenAccount } from "./Tokens";

export interface UserTokenAccountProgressProps {
  userAccount: string;
}

storiesOf("User Token Account", module)
  .addDecorator(StoryRouter()).add("User Token Account", () => {
    return (
      <UserTokenAccount
        userTutorialComplete={true}
        userAccount={"0x 3e39 fa98 3abc d349 d95a ed60 8e79 8817 397c f0d1"}
        supportEmailAddress={"support@civil.co"}
        faqUrl={"https://cvlconsensys.zendesk.com/hc/en-us"}
        foundationAddress={"0xf1176B0aeb7914B5472B61c97A4CF0E0bcacB579"}
      />
    );
  });
