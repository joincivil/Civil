import * as React from "react";
import { Redirect } from "react-router";

import { clearApolloSession } from "@joincivil/utils";

export const AuthLogout = () => {
  const [loggedOut, setLoggedOut] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => {
      clearApolloSession();
      setLoggedOut(true);
    }, 500);
  }, []);

  return loggedOut ? <Redirect to="/" /> : <div>Logging out...</div>;
};
