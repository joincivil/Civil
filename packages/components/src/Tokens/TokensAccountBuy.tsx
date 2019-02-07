import * as React from "react";
import {
  FlexColumnsPrimaryModule,
  TokenBtns,
  TokenBuySection,
  TokenBuyIntro,
  TokenAirswapSection,
  TokenConverterSection,
  TokenOrBreak,
  TokenExchangeSection,
  TokenCalcCVL,
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
  TokenCVLPriceText,
} from "./TokensTextComponents";
import { UserTokenAccountFaq } from "./TokensAccountFaq";
import { AirswapBuyCVL } from "../Airswap/AirswapBuyCVL";
import { CurrencyConverter } from "../CurrencyConverter/CurrencyConverter";

export interface TokenAccountBuyProps {
  foundationAddress: string;
  step?: string;
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
              <>
                <TokenAirswapFoundationText />
                <TokenConverterSection>
                  <CurrencyConverter currencyLabelLeft={"Enter amount of USD"} currencyLabelRight={"Amount of ETH"} />
                  <TokenCalcCVL>
                    <TokenCVLPriceText pricePerCvl={".10"} totalPrice={"200.0000"} />
                  </TokenCalcCVL>
                </TokenConverterSection>
                <AirswapBuyCVL buyCVLBtnText={<TokenBuyFoundationBtnText />} />
              </>

              <TokenOrBreak>
                <TokenOrText />
              </TokenOrBreak>

              <TokenExchangeSection>
                <TokenAirswapExchangeText />
                <AirswapBuyCVL buyCVLBtnText={<TokenBuyExchangeBtnText />} buyFromAddress={props.foundationAddress} />
              </TokenExchangeSection>
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
