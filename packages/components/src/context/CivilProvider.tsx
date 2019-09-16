import * as React from "react";
import { CivilContext, buildCivilContext } from "./CivilContext";
import { FeatureFlagService } from "@joincivil/core";
import { KirbyEthereum, KirbyEthereumProvider, KirbyEthereumContext } from "@kirby-web3/ethereum-react";

import { ApolloConsumer } from "react-apollo";
import ApolloClient from "apollo-client";

export interface CivilInnerProviderProps {
  config: any;
  featureFlags: string[];
  apolloClient?: ApolloClient<any>;
}

const CivilInnerProvider: React.FunctionComponent<CivilInnerProviderProps> = ({
  children,
  featureFlags,
  config,
  apolloClient,
}) => {
  // context
  const kirbyCtx = React.useContext<KirbyEthereum>(KirbyEthereumContext);
  const web3 = kirbyCtx.web3;

  if (kirbyCtx === null) {
    return <div></div>;
  }
  const [currentUser, setCurrentUser] = React.useState(null);

  const baseContext = React.useMemo(() => {
    function onAuthChange(nextUser: any): void {
      setCurrentUser(nextUser);
    }

    const ctx = buildCivilContext({ web3, apolloClient: apolloClient!, featureFlags, config, onAuthChange });

    return ctx;
  }, []);

  // state
  const civilContext = React.useMemo(() => {
    return { ...baseContext, currentUser };
  }, [baseContext, currentUser]);

  // render
  return <CivilContext.Provider value={civilContext}>{children}</CivilContext.Provider>;
};

export interface CivilProviderProps extends CivilInnerProviderProps {
  plugins?: any[];
  pluginConfig: any;
  makeLegacyWeb3(): any;
}

export const CivilProvider: React.FunctionComponent<CivilProviderProps> = ({
  children,
  featureFlags,
  pluginConfig,
  config,
  makeLegacyWeb3,
}) => {
  const featureFlagService = React.useMemo(() => {
    return new FeatureFlagService(featureFlags);
  }, [featureFlags]);

  if (!featureFlagService.featureEnabled("kirby")) {
    const mockKirby = React.useMemo(() => {
      const web3 = makeLegacyWeb3();
      console.log("not using kirby", web3);
      return { web3 };
    }, []);

    return (
      <ApolloConsumer>
        {client => (
          <KirbyEthereumContext.Provider value={mockKirby}>
            <CivilInnerProvider featureFlags={featureFlags} config={config} apolloClient={client}>
              {children}
            </CivilInnerProvider>
          </KirbyEthereumContext.Provider>
        )}
      </ApolloConsumer>
    );
  }

  return (
    <ApolloConsumer>
      {client => (
        <KirbyEthereumProvider config={pluginConfig}>
          <CivilInnerProvider featureFlags={featureFlags} config={config} apolloClient={client}>
            {children}
          </CivilInnerProvider>
        </KirbyEthereumProvider>
      )}
    </ApolloConsumer>
  );
};
