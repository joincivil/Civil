import * as React from "react";
import styled from "styled-components";
import { TokenBuyIntro } from "../TokensStyledComponents";
import { TokenSellInstructionsText } from "../TokensTextComponents";
import { UniswapSellSection } from "./UniswapSellSection";
import { Heading } from "../../Heading";
import { FullScreenModal } from "../../FullscreenModal";
import { ModalHeading, ModalContent } from "../../ModalContent";
import { Link } from "react-router-dom";

export interface TokensTabSellActiveProps {
  balance: string;
  onSellComplete(): void;
}

const BalanceContainer = styled.div`
  display: flex;
  flex-direction: row;
  > :first-child {
    flex-grow: 1;
  }
`;

const TokenInfoContainer = styled.div`
  margin: 20px;
  font-size: 16px;
  align-items: start;
  > p {
    font-size: 16px;
  }
`;

class CVLBalanceHeader extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
    this.state = {};
  }
  public render(): JSX.Element {
    const { balance } = this.props;

    return (
      <div>
        <BalanceContainer>
          <Heading>Available CVL to Sell</Heading>
          <Heading>{balance}</Heading>
        </BalanceContainer>
        <div>
          <a href="#" onClick={e => this.showModal(e)}>
            Don't see all of your tokens?
          </a>
        </div>
        <FullScreenModal open={this.state.showModal} dismissOnOutsideClick={true} handleClose={() => this.hideModal()}>
          <TokenInfoContainer>
            <ModalHeading>Don't see all of your tokens?</ModalHeading>
            <ModalContent>Check the amount of CVL in your voting balance.</ModalContent>
            <ModalContent>
              If your voting tokens are not used for any challenges, or votes, transfer them to your Available Balance
              in order to sell. You can do this within the{" "}
              <Link to="/dashboard/tasks/transfer-voting-tokens">Dashboard section</Link> .
            </ModalContent>
          </TokenInfoContainer>
        </FullScreenModal>
      </div>
    );
  }

  private showModal(e: any): void {
    e.preventDefault();
    this.setState({ showModal: true });
  }
  private hideModal(): void {
    this.setState({ showModal: false });
  }
}

export const TokensTabSellActive: React.StatelessComponent<TokensTabSellActiveProps> = props => {
  const { onSellComplete, balance } = props;

  return (
    <>
      <TokenBuyIntro>
        <CVLBalanceHeader balance={balance} />
      </TokenBuyIntro>

      <TokenSellInstructionsText />
      <UniswapSellSection onComplete={onSellComplete} />
    </>
  );
};
