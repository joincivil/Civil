import * as React from "react";
import {
  FlexColumnsPrimaryModule,
  TokenBtns,
  TokenBtnsInverted,
  TokenBuySection,
  TokenBuyIntro,
  TokenAirswapSection,
  TokenOrBreak,
  TokenExchangeSection,
  TokenThanksPurchase,
  TokenUnlock,
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
  TokenThanksText,
  TokenUnlockText,
  TokenUnlockBtnText,
} from "./TokensTextComponents";
import { AirswapBuyCVL } from "../Airswap/AirswapBuyCVL";
import { UsdEthCvlConverter } from "../CurrencyConverter/UsdEthCvlConverter";

export interface TokenAccountBuyProps {
  foundationAddress: string;
  network: string;
  faqUrl: string;
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
  } else if (props.step === "active") {
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
                <AirswapBuyCVL
                  network={props.network}
                  buyCVLBtnText={<TokenBuyFoundationBtnText />}
                  buyFromAddress={props.foundationAddress}
                />
              </>

              <TokenOrBreak>
                <TokenOrText />
              </TokenOrBreak>

              <TokenExchangeSection>
                <TokenAirswapExchangeText />
                <AirswapBuyCVL network={props.network} buyCVLBtnText={<TokenBuyExchangeBtnText />} />
              </TokenExchangeSection>
            </TokenAirswapSection>
          </TokenBuySection>
        </FlexColumnsPrimaryModule>
      </>
    );
  } else {
    tokenSection = (
      <>
        <FlexColumnsPrimaryModule padding={true}>
          <TokenBuySection>
            <TokenThanksPurchase>
              <TokenThanksText faqUrl={props.faqUrl} />
            </TokenThanksPurchase>
            <TokenUnlock>
              <TokenUnlockText />
              <TokenBtnsInverted to="/dashboard">
                <TokenUnlockBtnText />
              </TokenBtnsInverted>
            </TokenUnlock>
          </TokenBuySection>
        </FlexColumnsPrimaryModule>
      </>
    );
  }

  return tokenSection;
};
