import * as React from "react";
import NavBar from "./components/navbar/NavBar";
import Main from "./components/Main";
import { BrowserRouter as Router } from "react-router-dom";
import { dappTheme } from "./components/utility/ViewModules";
import { ThemeProvider } from "styled-components";

export const App = (): JSX.Element => {
  return (
    <Router>
      <ThemeProvider theme={dappTheme}>
        <>
          <NavBar />
          <Main />
        </>
      </ThemeProvider>
    </Router>
  );
};
