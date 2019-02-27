import * as React from "react";
import { TokenBuyIntro, TokenAirswapSection, TokenOrBreak, TokenExchangeSection } from "./TokensStyledComponents";
import {
  TokenBuyText,
  TokenAirswapFoundationText,
  TokenBuyFoundationBtnText,
  TokenOrText,
  TokenAirswapExchangeText,
  TokenBuyExchangeBtnText,
} from "./TokensTextComponents";
import { AirswapBuyCVL } from "../Airswap/AirswapBuyCVL";
import { UsdEthCvlConverter } from "../CurrencyConverter/UsdEthCvlConverter";

export interface TokensBuyTabProps {
  foundationAddress: string;
  network: string;
  onBuyComplete(): void;
}

export const TokensTabBuyActive: React.StatelessComponent<TokensBuyTabProps> = props => {
  const { foundationAddress, network, onBuyComplete } = props;

  return (
    <>
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
    </>
  );
};
