import * as React from "react";
import { Redirect } from "react-router";
import { StyledPageContentWithPadding } from "../utility/styledComponents";

import { clearCivilAuthenticatedSession } from "@joincivil/civil-session";

const AuthLogout = () => {
  const [loggedOut, setLoggedOut] = React.useState(false);
  React.useEffect(() => {
    clearCivilAuthenticatedSession().then(() => {
      setLoggedOut(true);
    });
  }, []);

  return loggedOut ? <Redirect to="/" /> : <StyledPageContentWithPadding>Logging out...</StyledPageContentWithPadding>;
};

export default AuthLogout;
