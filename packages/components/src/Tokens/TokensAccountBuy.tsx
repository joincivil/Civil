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
import { AirswapBuyCVL } from "../Airswap/AirswapBuyCVL";

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
                <TokenConverterSection>[TKTK currency converter component]</TokenConverterSection>
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
