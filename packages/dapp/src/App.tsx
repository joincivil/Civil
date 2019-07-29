import * as React from "react";
import { GlobalNav } from "./components/GlobalNav";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { ApolloProvider } from "react-apollo";
import { getApolloClient } from "@joincivil/utils";
import config from "./helpers/config";
import { ErrorBoundry } from "./components/errors/ErrorBoundry";

import { injectGlobal } from "styled-components";
import { colors, fonts, CivilContext, ICivilContext, buildCivilContext } from "@joincivil/components";
import { ConnectedRouter } from "connected-react-router";

import { history } from "./redux/store";
import { getCivil } from "./helpers/civilInstance";

// tslint:disable-next-line:no-unused-expression
injectGlobal`
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
              <>
                <GlobalNav />
                <Main />
                <Footer />
              </>
            </CivilContext.Provider>
          </ConnectedRouter>
        </ApolloProvider>
      </ErrorBoundry>
    );
  }
}
