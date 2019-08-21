import * as React from "react";
import { SetHandle, AuthApplicationEnum, AuthWrapper, AuthTextSigninWithEmail } from "@joincivil/components";

export interface AuthLoginProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

const SetUsername: React.FunctionComponent<AuthLoginProps> = props => {
  console.log("set username 1");
  return (
    <AuthWrapper>
      <SetHandle
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={false}
        onEmailSend={(isNewUser: boolean, emailAddress: string) => props.onEmailSend(isNewUser, emailAddress)}
        headerComponent={<AuthTextSigninWithEmail />}
        loginPath="/auth/login"
        signupPath="/auth/signup"
      />
    </AuthWrapper>
  );
};

export default SetUsername;
