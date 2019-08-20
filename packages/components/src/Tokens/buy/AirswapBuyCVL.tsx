import * as React from "react";
import makeAsyncScriptLoader from "react-async-script";
import { airswapScript, getAirswapCvlAddress, getAirswapEnv } from "@joincivil/utils";
import { Button } from "../../Button";

export interface BuyCVLProps {
  buyFromAddress?: string;
  buyCVLBtnText?: string | JSX.Element;
  network: string;
  amount?: number;
  onClick?(index: number): void;
  onComplete(): void;
}

class BuyCVLBase extends React.Component<BuyCVLProps> {
  public render(): JSX.Element {
    return <Button onClick={() => this.displayAirswap()}>{this.props.buyCVLBtnText || "Buy CVL"}</Button>;
  }

  private displayAirswap(): void {
    const environment = getAirswapEnv(this.props.network);
    const tokenAddress = getAirswapCvlAddress(this.props.network);
    const buyFromAddress = this.props.buyFromAddress || "";
    const amount = this.props.amount || 0;

    // this is pretty hacky, would probably be better off making this a bignumber and converting to wei
    // however, this doesn't display properly in Airswap if its more than 3 digits
    const amountString = Math.ceil(amount).toString() + "000000000000000000";

    console.log("amountString", amountString);

    // @ts-ignore
    window.AirSwap.Trader.render(
      {
        mode: "buy",
        env: environment,
        token: tokenAddress,
        address: buyFromAddress,
        // amount: amountString,
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

export const AirswapBuyCVL = makeAsyncScriptLoader(airswapScript)(BuyCVLBase);
