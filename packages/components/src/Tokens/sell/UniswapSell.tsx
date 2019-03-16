import * as React from "react";
import { CivilContext, ICivilContext } from "../../context/CivilContext";
import { Button } from "../../Button";
import { TokenAirswapSection } from "..";
import { TokenPurchaseSummary } from "../TokenPurchaseSummary";

export interface UniswapSellProps {
  ethExchangeRate: number;
  cvlToSell: number;
  etherToReceive: number;
}
export interface UniswapSellState {
  approvedTokens?: any;
}
export class UniswapSell extends React.Component<UniswapSellProps, UniswapSellState> {
  public static contextType: React.Context<ICivilContext> = CivilContext;
  constructor(props: UniswapSellProps) {
    super(props);
    this.state = {};
  }

  public async componentDidMount(): Promise<void> {
    const uniswap = this.context.uniswap;
    const approvedTokens = await uniswap.getApprovedSellAmount();
    this.setState({ ...this.state, approvedTokens });
  }

  public render(): JSX.Element {
    if (!this.state.approvedTokens) {
      return <div>loading...</div>;
    }

    const uniswap = this.context.uniswap;
    const { ethExchangeRate } = this.props;
    const usdAmount = this.props.etherToReceive * ethExchangeRate;
    const cvlWei = uniswap.parseEther((this.props.cvlToSell || "0").toString());
    const weiToReceive = uniswap.parseEther(this.props.etherToReceive.toString());
    let usdPerCVL: number = 0;
    let usdTotal: number = 0;
    if (this.props.cvlToSell > 0) {
      usdPerCVL = usdAmount / this.props.cvlToSell!;
      usdTotal = this.props.cvlToSell * usdPerCVL;
    }

    const summary = (
      <TokenPurchaseSummary
        mode="sell"
        currencyCode="CVL"
        pricePer={usdPerCVL}
        totalPrice={usdTotal}
        totalTokens={this.props.cvlToSell}
      />
    );

    const currentApproval = uniswap.weiToEtherNumber(this.state.approvedTokens);
    if (this.state.approvedTokens.lt(cvlWei)) {
      return (
        <>
          {summary}
          <TokenAirswapSection>
            <div>
              Almost there! Before you can proceed, you need to authorize the exchange to sell tokens on your behalf.
            </div>
            {currentApproval > 0 ? <div>You currently have authorized {currentApproval} CVL</div> : null}
            <Button onClick={async () => this.approve(cvlWei)}>
              Approve Exchange to Sell {this.props.cvlToSell} CVL
            </Button>
          </TokenAirswapSection>
        </>
      );
    }

    return (
      <>
        {summary}
        <TokenAirswapSection>
          <Button onClick={async () => this.sellCVL(cvlWei, weiToReceive)} disabled={this.props.cvlToSell === 0}>
            Sell {this.props.cvlToSell} CVL on Uniswap
          </Button>
        </TokenAirswapSection>
      </>
    );
  }

  private async sellCVL(cvlWei: any, weiToReceive: any): Promise<void> {
    const uniswap = this.context.uniswap;
    await uniswap.executeCVLToETH(cvlWei, weiToReceive);
  }

  private async approve(cvlWei: any): Promise<void> {
    const uniswap = this.context.uniswap;
    await uniswap.setApprovedSellAmount(cvlWei);
    const approvedTokens = await uniswap.getApprovedSellAmount();
    this.setState({ ...this.state, approvedTokens });
  }
}
