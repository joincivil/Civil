import * as React from "react";
import { Civil, UniswapService, makeEthersProvider, EthersProviderResult, FeatureFlagService } from "@joincivil/core";
import { DispatchProp } from "react-redux";

export interface ICivilContext {
  civil?: Civil;
  uniswap: UniswapService;
  features: FeatureFlagService;
  network: number;
  /** See `packages/dapp/src/helpers/config.ts` */
  config: any;
  setCivil(civil: Civil): void;
  waitForTx(txHash: string): Promise<void>;
  fireAnalyticsEvent(category: string, event: string, label: string, value: number): void;
  setAnalyticsEvent(fire: any): void;
}

export function buildCivilContext(
  civil?: Civil,
  defaultNetwork?: string,
  featureFlags?: string[],
  config?: any,
  setAnalyticsEvent?: (fire: any) => void,
): ICivilContext {
  const ctx: any = {};
  ctx.civil = civil;
  ctx.features = new FeatureFlagService(featureFlags);
  ctx.config = config || {};

  const { provider, signer, network }: EthersProviderResult = makeEthersProvider(defaultNetwork!);
  try {
    ctx.uniswap = new UniswapService(provider, signer, network);
  } catch (err) {
    console.error("failed to initalize uniswap", err);
  }
  ctx.network = network;

  ctx.setCivil = (_civil: Civil): void => {
    ctx.civil = _civil;
  };

  ctx.waitForTx = async (txHash: string) => provider.waitForTransaction(txHash);

  ctx.setAnalyticsEvent = (fire: any): void => {
    ctx.fireAnalyticsEvent = fire;
  };

  return ctx;
}

const defaultValue = buildCivilContext();
export const CivilContext = React.createContext<ICivilContext>(defaultValue);
