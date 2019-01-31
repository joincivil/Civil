import * as React from "react";
import { TokenBtns, TokenBuySection, TokenAirswapSection, TokenFAQCollapse } from "./TokensStyledComponents";
import {
  TokenBuyText,
  TokenBuyTextDisabled,
  TokenBuyBtnText,
  TokenBuyBtnDisabledText,
  TokenAirswapText,
  TokenETHFAQQuestion1Text,
  TokenETHFAQQuestion2Text,
  TokenETHFAQQuestion3Text,
  TokenETHFAQQuestion4Text,
} from "./TokensTextComponents";
import { Collapsable } from "../Collapsable";

export interface TokenAccountBuyProps {
  step?: string;
  openAirSwap(): void;
}

export const UserTokenAccountBuy: React.StatelessComponent<TokenAccountBuyProps> = props => {
  let tokenSection;
  if (props.step === "disabled") {
    tokenSection = (
      <TokenBuySection>
        <TokenBuyTextDisabled />
        <TokenBtns disabled={true}>
          <TokenBuyBtnDisabledText />
        </TokenBtns>
      </TokenBuySection>
    );
  } else {
    tokenSection = (
      <>
        <TokenBuySection>
          <TokenBuyText />

          <TokenAirswapSection>
            <TokenAirswapText />
            <TokenBtns onClick={props.openAirSwap}>
              <TokenBuyBtnText />
            </TokenBtns>
          </TokenAirswapSection>
        </TokenBuySection>

        <TokenFAQCollapse>
          <Collapsable header={<TokenETHFAQQuestion1Text />} open={false}>
            <p>TKTKTK</p>
          </Collapsable>
        </TokenFAQCollapse>
        <TokenFAQCollapse>
          <Collapsable header={<TokenETHFAQQuestion2Text />} open={false}>
            <p>TKTKTK</p>
          </Collapsable>
        </TokenFAQCollapse>
        <TokenFAQCollapse>
          <Collapsable header={<TokenETHFAQQuestion3Text />} open={false}>
            <p>TKTKTK</p>
          </Collapsable>
        </TokenFAQCollapse>
        <TokenFAQCollapse>
          <Collapsable header={<TokenETHFAQQuestion4Text />} open={false}>
            <p>TKTKTK</p>
          </Collapsable>
        </TokenFAQCollapse>
      </>
    );
  }

  return tokenSection;
};
