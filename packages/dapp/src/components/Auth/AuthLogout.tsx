import * as React from "react";
import { Redirect } from "react-router";
import { StyledPageContentWithPadding } from "../utility/styledComponents";

import { clearApolloSession } from "@joincivil/utils";

const AuthLogout = () => {
  const [loggedOut, setLoggedOut] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => {
      clearApolloSession();
      setLoggedOut(true);
    }, 500);
  }, []);

  return loggedOut ? <Redirect to="/" /> : <StyledPageContentWithPadding>Logging out...</StyledPageContentWithPadding>;
};

export default AuthLogout;
