import * as React from "react";
import NavBar from "./components/navbar/NavBar";
import Main from "./components/Main";
import { BrowserRouter as Router } from "react-router-dom";

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <Router>
        <>
          <NavBar />
          <Main />
        </>
      </Router>
    );
  }
}

export default App;
