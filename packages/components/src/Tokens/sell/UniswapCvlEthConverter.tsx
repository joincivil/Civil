import * as React from "react";
import { CivilContext, ICivilContext } from "../../context/CivilContext";
import { CurrencyConverter } from "../../CurrencyConverter/CurrencyConverter";

export interface UniswapCvlEthConverterProps {
  onConversion(cvlValue: number, ethValue: number): void;
}
export class UniswapCvlEthConverter extends React.Component<UniswapCvlEthConverterProps, any> {
  public static contextType: React.Context<ICivilContext> = CivilContext;
  public constructor(props: UniswapCvlEthConverterProps) {
    super(props);
  }
  public render(): JSX.Element {
    return (
      <CurrencyConverter
        currencyCodeFrom="CVL"
        currencyLabelFrom="Enter amount of CVL to sell"
        currencyCodeTo="ETH"
        currencyLabelTo="Estimated ETH from sale"
        doConversion={async (cvlAmount: number) => this.convertToETH(cvlAmount)}
        onConversion={(cvlValue, ethValue) => this.props.onConversion(cvlValue, ethValue)}
      />
    );
  }

  private async convertToETH(cvlAmount: number): Promise<number> {
    const uniswap = this.context.uniswap;
    const bn = uniswap.parseEther(cvlAmount.toString());
    const result = await uniswap.quoteCVLToETH(bn);

    return uniswap.weiToEtherNumber(result);
  }
}
