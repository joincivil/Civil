import * as React from "react";
import styled from "styled-components";
import { CivilContext, ICivilContext } from "../../context/CivilContext";
import { TokenPurchaseSummary } from "../TokenPurchaseSummary";
import { MetaMaskLogoButton } from "../../MetaMaskLogoButton";
import { Notice, NoticeTypes } from "../../Notice";
import { EthereumTransactionButton, EthereumTransactionInfo } from "../EthereumTransactionButton";
import { SellFeeNotice, ApproveNoticeText } from "../TokensTextComponents";

const SellContainer = styled.div`
  padding: 0;
  > button {
    margin-top: 25px;
    width: 100%;
  }
`;

const ApproveNotice = styled(Notice)`
  margin-top: 20px;
  padding-bottom: 10px;
  font-size: 14px;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  > div > button {
    margin: 20px;
  }
`;

export interface UniswapSellProps {
  ethExchangeRate: number;
  cvlToSell: number;
  onSellComplete(): void;
}
export interface UniswapSellState {
  approvedTokens?: any;
  weiToReceive?: number;
}
export class UniswapSell extends React.Component<UniswapSellProps, UniswapSellState> {
  public static contextType: React.Context<ICivilContext> = CivilContext;
  constructor(props: UniswapSellProps) {
    super(props);
    this.state = {};
  }

  public async componentDidUpdate(prevProps: UniswapSellProps): Promise<void> {
    if (prevProps.cvlToSell !== this.props.cvlToSell) {
      const uniswap = this.context.uniswap;
      const weiToReceive = await uniswap.quoteCVLToETH(uniswap.parseEther(this.props.cvlToSell.toString()));
      this.setState({ ...this.state, weiToReceive });
    }
  }

  public async componentDidMount(): Promise<void> {
    const uniswap = this.context.uniswap;
    const approvedTokens = await uniswap.getApprovedSellAmount();
    const weiToReceive = await uniswap.quoteCVLToETH(uniswap.parseEther(this.props.cvlToSell || "0"));
    this.setState({ ...this.state, approvedTokens, weiToReceive });
  }

  public render(): JSX.Element {
    if (!this.state.approvedTokens || !this.state.weiToReceive) {
      return <div />;
    }

    const uniswap = this.context.uniswap;
    const { ethExchangeRate } = this.props;
    const cvlWei = uniswap.parseEther((this.props.cvlToSell || "0").toString());
    const weiToReceive = this.state.weiToReceive;
    const etherToReceive = uniswap.weiToEtherNumber(this.state.weiToReceive);
    const usdAmount = etherToReceive * ethExchangeRate;
    let usdPerCVL: number = 0;
    let usdTotal: number = 0;

    if (this.props.cvlToSell === 0) {
      return (
        <SellContainer>
          <MetaMaskLogoButton onClick={() => null} disabled>
            Estimate Proceeds
          </MetaMaskLogoButton>
        </SellContainer>
      );
    }

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

    if (this.state.approvedTokens.lt(cvlWei)) {
      return (
        <SellContainer>
          {summary}
          <ApproveNotice type={NoticeTypes.ATTENTION}>
            <ApproveNoticeText cvlToSell={this.props.cvlToSell} />
            <EthereumTransactionButton
              modalHeading={`Confirm in Metamask to approve your sale of ${this.props.cvlToSell} CVL`}
              execute={async () => this.approve(cvlWei)}
              disabled={this.props.cvlToSell === 0}
              onComplete={async () => this.updateApprovedSellAmount()}
            >
              Open MetaMask to approve
            </EthereumTransactionButton>
            <SellFeeNotice />
          </ApproveNotice>
        </SellContainer>
      );
    }

    return (
      <SellContainer>
        {summary}
        <EthereumTransactionButton
          modalHeading={`Confirm in Metamask to complete your sale of ${this.props.cvlToSell} CVL`}
          execute={async () => this.sellCVL(cvlWei, weiToReceive)}
          disabled={this.props.cvlToSell === 0}
          onComplete={() => this.props.onSellComplete()}
        >
          Complete Sale
        </EthereumTransactionButton>
        <SellFeeNotice />
      </SellContainer>
    );
  }

  private async sellCVL(cvlWei: any, weiToReceive: any): Promise<EthereumTransactionInfo> {
    const uniswap = this.context.uniswap;
    return uniswap.executeCVLToETH(cvlWei, weiToReceive);
  }

  private async approve(cvlWei: any): Promise<EthereumTransactionInfo> {
    const uniswap = this.context.uniswap;
    return uniswap.setApprovedSellAmount(cvlWei);
  }

  private async updateApprovedSellAmount(): Promise<void> {
    const uniswap = this.context.uniswap;
    const approvedTokens = await uniswap.getApprovedSellAmount();
    this.setState({ ...this.state, approvedTokens });
  }
}
