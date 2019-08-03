import { AuthWeb3Login as AuthWeb3LoginComponent, AuthWeb3LoginProps } from "@joincivil/civil-session";
import * as React from "react";
import { Helmet } from "react-helmet";

import { routes } from "../../constants";
import { StyledPageContentWithPadding } from "../utility/styledComponents";

const AuthWeb3LoginPage: React.FunctionComponent<AuthWeb3LoginProps> = props => {
  return (
    <StyledPageContentWithPadding centerContent={true}>
      <Helmet title={`Login - The Civil Registry`} />
      <div>
        <AuthWeb3LoginComponent
          onAuthenticationContinue={props.onAuthenticationContinue}
          authSignupURL={routes.AUTH_SIGNUP_WEB3}
        />
      </div>
    </StyledPageContentWithPadding>
  );
};

export default AuthWeb3LoginPage;
