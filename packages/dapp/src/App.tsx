import * as React from "react";
import { GlobalNavBar } from "./components/NavBar";
import Main from "./components/Main";
import { BrowserRouter as Router } from "react-router-dom";

export const App = (): JSX.Element => {
  return (
    <Router>
      <>
        <GlobalNavBar />
        <Main />
      </>
    </Router>
  );
};
