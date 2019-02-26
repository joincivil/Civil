import * as React from "react";
import makeAsyncScriptLoader from "react-async-script";
import { airswapScript, getAirswapCvlAddress, getAirswapEnv } from "@joincivil/utils";
import { Button } from "../Button";

export interface SellCVLProps {
  sellCVLBtnText?: string | JSX.Element;
  network: string;
  onClick?(index: number): void;
  onComplete(): void;
}

class SellCVLBase extends React.Component<SellCVLProps> {
  public render(): JSX.Element {
    return <Button onClick={() => this.displayAirswap()}>{this.props.sellCVLBtnText || "Sell CVL"}</Button>;
  }

  private displayAirswap(): void {
    const environment = getAirswapEnv(this.props.network);
    const tokenAddress = getAirswapCvlAddress(this.props.network);

    // @ts-ignore
    window.AirSwap.Trader.render(
      {
        mode: "sell",
        env: environment,
        token: tokenAddress,
        onComplete: () => {
          this.props.onComplete();
        },
        onCancel: () => {
          console.info("Trade cancelled");
        },
      },
      "body",
    );
  }
}

export const AirswapSellCVL = makeAsyncScriptLoader(airswapScript)(SellCVLBase);
