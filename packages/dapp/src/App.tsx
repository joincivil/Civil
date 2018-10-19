import * as React from "react";
import { GlobalNav } from "./components/GlobalNav";
import Main from "./components/Main";
import { BrowserRouter as Router } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "https://graphql.staging.civil.app/v1/query",
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
