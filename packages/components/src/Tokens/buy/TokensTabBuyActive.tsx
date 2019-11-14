import * as React from "react";
import { TokenAirswapSection, TokenOrBreak } from "../TokensStyledComponents";
import {
  TokenBuyText,
  TokenOrText,
  TokenAirswapExchangeTermsOfSaleText,
  TokenAirswapFoundationText,
  TokenUniswapExchangeText,
} from "../TokensTextComponents";
import { UniswapBuySection } from "./UniswapBuySection";
import { AirswapBuySection } from "./AirswapBuySection";
import { UsdEthConverter } from "../../CurrencyConverter/UsdEthConverter";
import { FeatureFlag } from "../../features/FeatureFlag";
import { PaddedSection } from "../../containers";
import { Notice, NoticeTypes } from "../../Notice";

export interface TokensTabBuyActiveProps {
  foundationAddress: string;
  network: string;
  onBuyComplete(): void;
}

export class TokensTabBuyActive extends React.Component<TokensTabBuyActiveProps, any> {
  constructor(props: TokensTabBuyActiveProps) {
    super(props);
    this.state = { etherToSpend: 0, usdToSpend: 0 };
  }
  public render(): JSX.Element {
    const { foundationAddress, network, onBuyComplete } = this.props;

    return (
      <>
        <Notice type={NoticeTypes.ALERT}>
          <TokenBuyText />
        </Notice>
        <TokenAirswapSection>
          <FeatureFlag feature="uniswap">
            <TokenUniswapExchangeText />
            <PaddedSection>
              <UsdEthConverter onConversion={(usd: number, eth: number) => this.setConvertedAmount(usd, eth)} />
            </PaddedSection>
            <UniswapBuySection
              usdToSpend={this.state.usdToSpend}
              ethToSpend={this.state.etherToSpend}
              onBuyComplete={onBuyComplete}
            />
            <TokenAirswapExchangeTermsOfSaleText />
          </FeatureFlag>
          <FeatureFlag feature="airswap">
            <TokenOrBreak>
              <TokenOrText />
            </TokenOrBreak>
            <TokenAirswapSection>
              <TokenAirswapFoundationText />
              <AirswapBuySection
                foundationAddress={foundationAddress}
                usdToSpend={this.state.usdToSpend}
                ethToSpend={this.state.etherToSpend}
                onBuyComplete={onBuyComplete}
                network={network}
              />
            </TokenAirswapSection>
          </FeatureFlag>
        </TokenAirswapSection>
      </>
    );
  }

  private setConvertedAmount(usdToSpend: number, etherToSpend: number): void {
    this.setState({ ...this.state, usdToSpend, etherToSpend });
  }
}
