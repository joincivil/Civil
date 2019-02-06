import * as React from "react";
import makeAsyncScriptLoader from "react-async-script";
import styled, { StyledComponentClass } from "styled-components";
import { Button, ButtonProps } from "../Button";

const AIRSWAP_URL = "https://cdn.airswap.io/gallery/airswap-trader.js";

export const AirSwapBtn: StyledComponentClass<ButtonProps, "button"> = styled(Button)`
  border-radius: 1px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: none;
`;

export interface BuyCVLProps {
  buyCVLBtnText?: string;
  onClick?(index: number): void;
}

class BuyCVLBase extends React.Component<BuyCVLProps> {
  public render(): JSX.Element {
    return <AirSwapBtn onClick={() => this.displayAirswap()}>{this.props.buyCVLBtnText || "Buy CVL"}</AirSwapBtn>;
  }

  private displayAirswap(): void {
    // const mainnet = "";
    const rinkeby = "0x3e39fa983abcd349d95aed608e798817397cf0d1";

    // @ts-ignore
    window.AirSwap.Trader.render(
      {
        mode: "buy",
        env: "sandbox",
        token: rinkeby,
        onComplete: (transactionId: string) => {
          console.info("Trade complete. Thank you, come again.", transactionId);
        },
        onCancel: () => {
          console.info("Trade cancelled");
        },
      },
      "body",
    );
  }
}

export const AirswapBuyCVL = makeAsyncScriptLoader(AIRSWAP_URL)(BuyCVLBase);
