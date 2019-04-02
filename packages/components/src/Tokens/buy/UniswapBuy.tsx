import * as React from "react";
import { CurrencyCalcCVL, CurrencyConverterSection } from "../../CurrencyConverter";
import { CivilContext, ICivilContext } from "../../context";
import { TokenPurchaseSummary } from "../TokenPurchaseSummary";
import { EthereumTransactionButton, EthereumTransactionInfo } from "../EthereumTransactionButton";

export interface UniswapBuyProps {
  usdToSpend: number;
  ethToSpend: number;
  ethExchangeRate: number;
  onBuyComplete(): void;
}
export class UniswapBuy extends React.Component<UniswapBuyProps, any> {
  public static contextType: React.Context<ICivilContext> = CivilContext;
  constructor(props: UniswapBuyProps) {
    super(props);
    this.state = {};
  }
  public async componentDidMount(): Promise<void> {
    await this.updatePrice();
  }
  public async componentDidUpdate(prevProps: UniswapBuyProps): Promise<void> {
    if (prevProps.ethToSpend !== this.props.ethToSpend) {
      await this.updatePrice();
    }
  }

  public render(): JSX.Element {
    const { ethToSpend, ethExchangeRate } = this.props;

    if (!this.state.cvlToReceive) {
      return <div>loading price...</div>;
    }
    const uniswap = this.context.uniswap;
    const cvl = uniswap.weiToEtherNumber(this.state.cvlToReceive);

    let pricePerCVL;
    if (ethToSpend === 0) {
      pricePerCVL = 0;
    } else {
      pricePerCVL = ethExchangeRate * ethToSpend / cvl;
    }

    return (
      <CurrencyConverterSection>
        <CurrencyCalcCVL>
          <TokenPurchaseSummary
            mode="buy"
            currencyCode="CVL"
            pricePer={pricePerCVL}
            totalTokens={cvl}
            totalPrice={pricePerCVL * cvl}
          />
        </CurrencyCalcCVL>
        <div>
          <EthereumTransactionButton
            modalHeading={`Confirm in Metamask to complete your purchase of ${cvl} CVL`}
            execute={async () => this.buyCVL()}
            disabled={this.props.usdToSpend === 0}
            onComplete={() => this.props.onBuyComplete()}
          >
            Buy CVL on the open market from Uniswap
          </EthereumTransactionButton>
        </div>
      </CurrencyConverterSection>
    );
  }

  private async updatePrice(): Promise<void> {
    const uniswap = this.context.uniswap;
    const weiToSpend = uniswap.parseEther(this.props.ethToSpend.toString());
    const result = await uniswap.quoteETHToCVL(weiToSpend);

    this.setState({ cvlToReceive: result });
  }

  private async buyCVL(): Promise<EthereumTransactionInfo> {
    const uniswap = this.context.uniswap;
    const weiToSpend = uniswap.parseEther(this.props.ethToSpend.toString());
    return uniswap.executeETHToCVL(weiToSpend, this.state.cvlToReceive);
  }
}
