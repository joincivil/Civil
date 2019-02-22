import { storiesOf } from "@storybook/react";
import * as React from "react";
import apolloStorybookDecorator from "apollo-storybook-react";
import { AuthEmailVerify } from "./AuthStyledComponents";

const onAuthenticationContinue = (): void => {
  console.log("Click");
  return;
};

storiesOf("Account/VerifyToken", module)
  .add("Loading", () => {
    return (
      <AuthEmailVerify
        hasVerified={false}
        errorMessage={undefined}
        onAuthenticationContinue={onAuthenticationContinue}
      />
    );
  })
  .add("Error", () => {
    return (
      <AuthEmailVerify
        hasVerified={true}
        errorMessage={"Error is bad"}
        onAuthenticationContinue={onAuthenticationContinue}
      />
    );
  })
  .add("Complete", () => {
    return (
      <AuthEmailVerify
        hasVerified={true}
        errorMessage={undefined}
        onAuthenticationContinue={onAuthenticationContinue}
      />
    );
  });
