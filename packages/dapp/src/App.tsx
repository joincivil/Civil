import * as React from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import { BrowserRouter as Router } from "react-router-dom";

import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <Router>
      <StyledDiv>
        <Header />
        <Main />
      </StyledDiv>
      </Router>
    );
  }
}

export default App;
