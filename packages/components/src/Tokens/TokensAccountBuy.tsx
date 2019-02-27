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
import { TOKEN_PROGRESS } from "./Tokens";

export interface TokenAccountBuyProps {
  foundationAddress: string;
  network: string;
  faqUrl: string;
  step?: string;
  onBuyComplete(): void;
}

export const UserTokenAccountBuy: React.StatelessComponent<TokenAccountBuyProps> = props => {
  const { foundationAddress, network, faqUrl, step, onBuyComplete } = props;
  let tokenSection;

  if (step === TOKEN_PROGRESS.DISABLED) {
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
  } else if (step === TOKEN_PROGRESS.ACTIVE) {
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
                  network={network}
                  buyCVLBtnText={<TokenBuyFoundationBtnText />}
                  buyFromAddress={foundationAddress}
                  onComplete={onBuyComplete}
                />
              </>

              <TokenOrBreak>
                <TokenOrText />
              </TokenOrBreak>

              <TokenExchangeSection>
                <TokenAirswapExchangeText />
                <AirswapBuyCVL network={network} buyCVLBtnText={<TokenBuyExchangeBtnText />} />
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
              <TokenThanksText faqUrl={faqUrl} />
            </TokenThanksPurchase>
            <TokenUnlock>
              <TokenUnlockText />
              <TokenBtnsInverted to="/dashboard/tasks/transfer-voting-tokens">
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
