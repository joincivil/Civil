import * as React from "react";
import makeAsyncScriptLoader from "react-async-script";
import { Redirect } from "react-router-dom";
import { airswapScript, getAirswapCvlAddress, getAirswapEnv } from "@joincivil/utils";
import { Button } from "../Button";

export interface BuyCVLProps {
  buyFromAddress?: string;
  buyCVLBtnText?: string | JSX.Element;
  network: string;
  onClick?(index: number): void;
}

class BuyCVLBase extends React.Component<BuyCVLProps> {
  public render(): JSX.Element {
    return <Button onClick={() => this.displayAirswap()}>{this.props.buyCVLBtnText || "Buy CVL"}</Button>;
  }

  private displayAirswap(): void {
    const environment = getAirswapEnv(this.props.network);
    const tokenAddress = getAirswapCvlAddress(this.props.network);
    const buyFromAddress = this.props.buyFromAddress || "";

    // @ts-ignore
    window.AirSwap.Trader.render(
      {
        mode: "buy",
        env: environment,
        token: tokenAddress,
        address: buyFromAddress,
        onComplete: () => {
          return <Redirect to="/dashboard" />;
        },
        onCancel: () => {
          console.info("Trade cancelled");
        },
      },
      "body",
    );
  }
}

export const AirswapBuyCVL = makeAsyncScriptLoader(airswapScript)(BuyCVLBase);
