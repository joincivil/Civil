import * as React from "react";
import { UserSetHandle, AuthApplicationEnum, AuthWrapper, AuthTextSetHandle } from "@joincivil/components";

export interface AuthLoginProps {
  onEmailSend(isNewUser: boolean, emailAddress: string): void;
}

const SetUsername: React.FunctionComponent<AuthLoginProps> = props => {
  return (
    <AuthWrapper>
      <UserSetHandle
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={false}
        onEmailSend={(isNewUser: boolean, emailAddress: string) => props.onEmailSend(isNewUser, emailAddress)}
        headerComponent={<AuthTextSetHandle />}
      />
    </AuthWrapper>
  );
};

export default SetUsername;
