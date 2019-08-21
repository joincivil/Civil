import * as React from "react";
import { UserSetHandle, AuthApplicationEnum, AuthWrapper, AuthTextSetHandle } from "@joincivil/components";

const SetUsername: React.FunctionComponent<> = props => {
  return (
    <AuthWrapper>
      <UserSetHandle
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={false}
        headerComponent={<AuthTextSetHandle />}
      />
    </AuthWrapper>
  );
};

export default SetUsername;
