import { AuthWeb3Signup as AuthWeb3SignupComponent, AuthWeb3SignUpProps } from "@joincivil/civil-session";
import * as React from "react";
import { Helmet } from "react-helmet";

import { routes } from "../../constants";
import { StyledPageContentWithPadding } from "../utility/styledComponents";

const AuthWeb3SignupPage: React.FunctionComponent<AuthWeb3SignUpProps> = props => {
  return (
    <StyledPageContentWithPadding centerContent={true}>
      <Helmet title={`Sign up - The Civil Registry`} />
      <AuthWeb3SignupComponent
        onAuthenticatedContinue={props.onAuthenticatedContinue}
        authLoginURL={routes.AUTH_LOGIN_WEB3}
      />
    </StyledPageContentWithPadding>
  );
};

export default React.memo(AuthWeb3SignupPage);
