import * as React from "react";
import { GlobalNav } from "./components/GlobalNav";
import Main from "./components/Main";
import { BrowserRouter as Router } from "react-router-dom";

export const App = (): JSX.Element => {
  return (
    <Router>
      <>
        <GlobalNav />
        <Main />
      </>
    </Router>
  );
};
