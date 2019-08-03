import * as React from "react";
import { Redirect } from "react-router";
import { StyledPageContentWithPadding } from "../utility/styledComponents";

import { clearCivilSession } from "@joincivil/civil-session";

const AuthLogout = () => {
  const [loggedOut, setLoggedOut] = React.useState(false);
  React.useEffect(() => {
    clearCivilSession().then(() => {
      setLoggedOut(true);
    });
  }, []);

  return loggedOut ? <Redirect to="/" /> : <StyledPageContentWithPadding>Logging out...</StyledPageContentWithPadding>;
};

export default AuthLogout;
