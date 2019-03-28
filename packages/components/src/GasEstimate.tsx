import * as React from "react";
import { Civil } from "@joincivil/core";
import { fonts, colors } from "./styleConstants";
import styled from "styled-components";

export interface GasEstimateProps {
  civil: Civil;
  estimateFunctions: Array<() => Promise<number>>;
}

export interface GasEstimateState {
  price: number;
  priceFailed: boolean;
}

const SmallText = styled.p`
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 13px;
  line-height: 18px;
  display: flex;
  align-items: center;
  margin: 0;
`;

export class GasEstimate extends React.Component<GasEstimateProps, GasEstimateState> {
  constructor(props: GasEstimateProps) {
    super(props);
    this.state = {
      price: 0,
      priceFailed: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    await this.divinePrice(this.props.estimateFunctions);
  }

  public async divinePrice(estimateFunctions?: Array<() => Promise<number>>): Promise<void> {
    if (estimateFunctions && estimateFunctions.length) {
      try {
        const gas = (await Promise.all(estimateFunctions.map(async item => item()))).reduce(
          (acc: number, item: number) => acc + item,
          0,
        );
        const gasPrice = await this.props.civil!.getGasPrice();
        this.setState({
          price: gasPrice
            .times(gas)
            .div(this.props.civil!.toBigNumber(10).pow(18))
            .toNumber(),
          priceFailed: false,
        });
      } catch (error) {
        console.error(error);
        this.setState({ priceFailed: true });
      }
    } else {
      this.setState({ priceFailed: true });
    }
  }

  public render(): JSX.Element {
    if (this.state.price === 0 && !this.state.priceFailed) {
      return <SmallText>Estimating cost...</SmallText>;
    } else if (this.state.priceFailed) {
      return <SmallText>Could not estimate cost.</SmallText>;
    } else {
      return <SmallText>ETH: {this.state.price.toFixed(5)}</SmallText>;
    }
  }
}
