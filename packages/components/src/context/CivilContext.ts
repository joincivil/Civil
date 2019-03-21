import * as React from "react";
import { Civil, UniswapService, makeEthersProvider, EthersProviderResult, FeatureFlagService } from "@joincivil/core";

export interface ICivilContext {
  civil?: Civil;
  uniswap: UniswapService;
  features: FeatureFlagService;
  network: number;
  setCivil(civil: Civil): void;
}

export function buildCivilContext(civil?: Civil, defaultNetwork?: string): ICivilContext {
  const ctx: any = {};
  ctx.civil = civil;
  ctx.features = new FeatureFlagService();

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

  return ctx;
}

const defaultValue = buildCivilContext();
export const CivilContext = React.createContext<ICivilContext>(defaultValue);
