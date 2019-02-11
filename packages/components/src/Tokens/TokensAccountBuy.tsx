import * as React from "react";
import {
  FlexColumnsPrimaryModule,
  TokenBtns,
  TokenBuySection,
  TokenBuyIntro,
  TokenAirswapSection,
  TokenOrBreak,
  TokenExchangeSection,
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
import { AirswapBuyCVL } from "../Airswap/AirswapBuyCVL";
import { UsdEthCvlConverter } from "../CurrencyConverter/UsdEthCvlConverter";

export interface TokenAccountBuyProps {
  foundationAddress: string;
  network: string;
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
                <UsdEthCvlConverter currencyLabelLeft={"Enter amount of USD"} currencyLabelRight={"Amount of ETH"} />
                <AirswapBuyCVL buyCVLBtnText={<TokenBuyFoundationBtnText />} />
              </>

              <TokenOrBreak>
                <TokenOrText />
              </TokenOrBreak>

              <TokenExchangeSection>
                <TokenAirswapExchangeText />
                <AirswapBuyCVL
                  network={props.network}
                  buyCVLBtnText={<TokenBuyExchangeBtnText />}
                  buyFromAddress={props.foundationAddress}
                />
              </TokenExchangeSection>
            </TokenAirswapSection>
          </TokenBuySection>
        </FlexColumnsPrimaryModule>
      </>
    );
  }

  return tokenSection;
};
