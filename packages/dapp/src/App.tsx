import * as React from "react";
import { GlobalNav } from "./components/GlobalNav";
import Main from "./components/Main";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { getApolloClient } from "@joincivil/utils";

const client = getApolloClient({
  uri: "https://graphql.staging.civil.app/v1/query",
  // uri: "http://localhost:8080/v1/query", - use this when testing locally
});

export const App = (): JSX.Element => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <GlobalNav />
          <Main />
        </>
      </Router>
    </ApolloProvider>
  );
};
