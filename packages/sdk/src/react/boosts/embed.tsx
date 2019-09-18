/**
 * * * * * * * * *  * * *
 * * * * DEPRECATED * * *
 * * * * * * * * *  * * *
 * Deprecated in favor of boost embed standalone route in dapp. Leaving this code here as a proof-of-concept of loading our content in any context, which we might use for PEW widget. This code will instantiate the boost component in the page element with id `civil-boost`.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { getApolloClient } from "@joincivil/utils";
import { Civil, makeEthersProvider, EthersProviderResult } from "@joincivil/core";
import { CivilContext, buildCivilContext } from "@joincivil/components";
import { Boost } from "./Boost";

const apolloClient = getApolloClient();

const { provider }: EthersProviderResult = makeEthersProvider("1");
// @ts-ignore: @WIP/tobek Not sure what the issue is and if this needs fixing.
const civil = new Civil({ web3Provider: provider });
// @ts-ignore: Getting "Argument of type ... is not assignable to parameter of type ... Types have separate declarations of private property `ethApi`" because `buildCivilContext` is getting `Civil` from its copy of `@joincivil/core` and we're passing in from our copy. In practice, these `ethApi`s will be identical or matching interface.
const civilContext = buildCivilContext(civil);

const boostId = new URLSearchParams(window.location.search).get("boost");

function init(): void {
  ReactDOM.render(
    boostId ? (
      // @ts-ignore: bugs with apollo types e.g. https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/166
      <ApolloProvider client={apolloClient}>
        <CivilContext.Provider value={civilContext}>
          <Boost boostId={boostId} open={true} />
        </CivilContext.Provider>
      </ApolloProvider>
    ) : (
      <p>Missing Boost ID.</p>
    ),
    document.getElementById("civil-boost"),
  );
}

if (document.readyState === "complete") {
  init();
} else {
  window.addEventListener("load", init);
}
