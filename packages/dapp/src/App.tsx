import * as React from "react";
import { NavBar } from "@joincivil/components";
import Main from "./components/Main";
import { BrowserRouter as Router } from "react-router-dom";

export const App = (): JSX.Element => {
  return (
    <Router>
      <>
        <NavBar />
        <Main />
      </>
    </Router>
  );
};
