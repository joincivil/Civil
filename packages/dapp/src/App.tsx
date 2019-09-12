import * as React from "react";
import { GlobalNav } from "./components/GlobalNav";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { ApolloProvider } from "react-apollo";
import { getApolloClient } from "@joincivil/utils";
import config from "./helpers/config";
import { ErrorBoundry } from "./components/errors/ErrorBoundry";

import { createGlobalStyle } from "styled-components";
import { colors, fonts, CivilContext, ICivilContext, buildCivilContext, LoadUser } from "@joincivil/components";
import { ConnectedRouter } from "connected-react-router";

import { history } from "./redux/store";
import { getCivil } from "./helpers/civilInstance";
import { Web3AuthWrapper } from "./components/Web3AuthWrapper";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${fonts.SANS_SERIF};
  }

  a {
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

console.log("using config:", config);

const client = getApolloClient();
export class App extends React.Component {
  private civilContext: ICivilContext;
  public constructor(props: any) {
    super(props);
    const civil = getCivil();
    const featureFlags = config.FEATURE_FLAGS ? config.FEATURE_FLAGS.split(",") : [];
    this.civilContext = buildCivilContext(civil, config.DEFAULT_ETHEREUM_NETWORK, featureFlags, config);
  }
  public render(): JSX.Element {
    return (
      <ErrorBoundry>
        <ApolloProvider client={client}>
          <ConnectedRouter history={history}>
            <CivilContext.Provider value={this.civilContext}>
              <LoadUser>
                {({ user: civilUser }) => {
                  return (
                    <>
                      <Web3AuthWrapper civilUser={civilUser} />
                      <GlobalNav civilUser={civilUser} />
                      <Main civilUser={civilUser} />
                      <Footer />
                    </>
                  );
                }}
              </LoadUser>
            </CivilContext.Provider>
          </ConnectedRouter>
        </ApolloProvider>
        <GlobalStyle />
      </ErrorBoundry>
    );
  }
}
