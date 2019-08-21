import * as React from "react";
import { UserSetHandle, AuthApplicationEnum, AuthWrapper, AuthTextSigninWithEmail } from "@joincivil/components";

export interface AuthLoginProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

const SetUsername: React.FunctionComponent<AuthLoginProps> = props => {
  console.log("set username 1");
  return (
    <AuthWrapper>
      <UserSetHandle
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={false}
        onEmailSend={(isNewUser: boolean, emailAddress: string) => props.onEmailSend(isNewUser, emailAddress)}
        headerComponent={<AuthTextSigninWithEmail />}
      />
    </AuthWrapper>
  );
};

export default SetUsername;
