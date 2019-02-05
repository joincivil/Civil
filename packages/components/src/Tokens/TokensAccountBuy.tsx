import * as React from "react";
import { FlexColumnsPrimaryModule, TokenBtns, TokenBuySection, TokenAirswapSection } from "./TokensStyledComponents";
import {
  TokenBuyText,
  TokenBuyTextDisabled,
  TokenBuyBtnText,
  TokenBuyBtnDisabledText,
  TokenAirswapText,
} from "./TokensTextComponents";
import { UserTokenAccountFaq } from "./TokensAccountFaq";

export interface TokenAccountBuyProps {
  step?: string;
  openAirSwap(): void;
}

export const UserTokenAccountBuy: React.StatelessComponent<TokenAccountBuyProps> = props => {
  let tokenSection;
  if (props.step === "disabled") {
    tokenSection = (
      <FlexColumnsPrimaryModule padding={true}>
        <TokenBuySection>
          <TokenBuyTextDisabled />
          <TokenBtns disabled={true}>
            <TokenBuyBtnDisabledText />
          </TokenBtns>
        </TokenBuySection>
      </FlexColumnsPrimaryModule>
    );
  } else {
    tokenSection = (
      <>
        <FlexColumnsPrimaryModule padding={true}>
          <TokenBuySection>
            <TokenBuyText />

            <TokenAirswapSection>
              <TokenAirswapText />
              <TokenBtns onClick={props.openAirSwap}>
                <TokenBuyBtnText />
              </TokenBtns>
            </TokenAirswapSection>
          </TokenBuySection>
        </FlexColumnsPrimaryModule>

        <FlexColumnsPrimaryModule>
          <UserTokenAccountFaq />
        </FlexColumnsPrimaryModule>
      </>
    );
  }

  return tokenSection;
};
