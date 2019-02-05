import * as React from "react";
import {
  FlexColumnsPrimaryModule,
  TokenBtns,
  TokenBtnsInverted,
  TokenBuySection,
  TokenBuyIntro,
  TokenAirswapSection,
  TokenConverterSection,
  TokenOrBreak,
} from "./TokensStyledComponents";
import {
  TokenBuyText,
  TokenBuyTextDisabled,
  TokenBuyFoundationBtnText,
  TokenBuyBtnDisabledText,
  TokenAirswapFoundationText,
  TokenAirswapExchangeText,
  TokenBuyExchangeBtnText,
  TokenOrText,
} from "./TokensTextComponents";
import { UserTokenAccountFaq } from "./TokensAccountFaq";

export interface TokenAccountBuyProps {
  step?: string;
  openAirSwapFoundation(): void;
  openAirSwapExchange(): void;
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
            <TokenBuyIntro>
              <TokenBuyText />
            </TokenBuyIntro>

            <TokenAirswapSection>
              <TokenAirswapFoundationText />
              <TokenConverterSection>[TKTK currency converter component]</TokenConverterSection>
              <TokenBtns onClick={props.openAirSwapFoundation}>
                <TokenBuyFoundationBtnText />
              </TokenBtns>

              <TokenOrBreak>
                <TokenOrText />
              </TokenOrBreak>

              <TokenAirswapExchangeText />
              <TokenBtnsInverted onClick={props.openAirSwapExchange}>
                <TokenBuyExchangeBtnText />
              </TokenBtnsInverted>
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
