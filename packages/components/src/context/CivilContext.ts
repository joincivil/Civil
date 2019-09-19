import * as React from "react";
import { Civil, UniswapService, FeatureFlagService, EthersProviderResult, makeEthersProvider } from "@joincivil/core";
import { AuthService } from "./AuthService";
import ApolloClient from "apollo-client";

export interface ICivilContext {
  // services
  civil?: Civil;
  uniswap: UniswapService;
  features: FeatureFlagService;
  auth: AuthService;

  // web3
  web3Provider: any;
  network: number;

  // fields that should trigger context re-renders
  currentUser: any;

  /** See `packages/dapp/src/helpers/config.ts` */
  config: any;
  // other things that should probably be put into a service
  waitForTx(txHash: string): Promise<any>;
  fireAnalyticsEvent(category: string, event: string, label: string, value: number): void;
  setAnalyticsEvent(fire: any): void;
}

export interface CivilContextOptions {
  web3: any;
  featureFlags: string[];
  config: any;
  apolloClient?: ApolloClient<any>;
  onAuthChange?(nextUser: any): void;
}

export function buildCivilContext(opts: CivilContextOptions): ICivilContext {
  const { web3, apolloClient, config, featureFlags, onAuthChange } = opts;

  if (!web3) {
    throw new Error("expecting web3 to be initialized");
  }

  console.log("building new context");
  const civil = new Civil({ web3Provider: opts.web3.currentProvider });
  const web3Provider = web3.currentProvider;
  const network = web3.currentProvider.networkVersion || config.DEFAULT_ETHEREUM_NETWORK;

  const auth = new AuthService({ apolloClient: apolloClient!, onAuthChange: onAuthChange! });
  const features = new FeatureFlagService(featureFlags);

  const { provider, signer }: EthersProviderResult = makeEthersProvider(web3Provider, network);
  const uniswap = new UniswapService(provider, signer, network);

  const ctx: ICivilContext = {
    // services
    civil,
    auth,
    features,
    uniswap,

    // web3
    web3Provider: web3.currentProvider,
    // fields that should trigger context re-renders
    currentUser: auth.currentUser,
    network,

    // other things that should probably be put into a service
    config,
    fireAnalyticsEvent: (category: string, event: string, label: string, value: number) => undefined,
    setAnalyticsEvent: (fire: any): void => {
      ctx.fireAnalyticsEvent = fire;
    },
    waitForTx: async (txHash: string) => provider.waitForTransaction(txHash),
  };

  return ctx;
}

// @ts-ignore ignore default value typescript error
export const CivilContext = React.createContext<ICivilContext>(null);
