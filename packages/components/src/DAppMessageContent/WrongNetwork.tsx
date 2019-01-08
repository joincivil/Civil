import * as React from "react";
import * as metaMaskNetworkSwitchUrl from "../images/img-metamask-networkswitch@2x.png";
import { Modal } from "../Modal";
import { MetaMaskMockImage, MetaMaskIcon, StyledLargeModalText, StyledSmallModalText } from "./styledComponents";

export interface WrongNetworkComponentProps {
  requiredNetworkNiceName: string;
  helpUrlBase: string;
}

export const WrongNetworkComponent: React.SFC<WrongNetworkComponentProps> = props => {
    return (
      <>
        <StyledLargeModalText>
          <b>Change your network.</b>{" "}
          Looks like you’re using an unsupported Ethereum network. Make sure you're using the{" "}
          <b>{props.requiredNetworkNiceName}</b>.
        </StyledLargeModalText>
        <StyledSmallModalText>
          <a
            href={props.helpUrlBase + "articles/360017414812-How-do-I-switch-networks-in-MetaMask-"}
            target="_blank"
          >
            Read this tutorial
          </a>{" "}
          to switch networks in MetaMask <MetaMaskIcon />
        </StyledSmallModalText>
        <MetaMaskMockImage src={metaMaskNetworkSwitchUrl} />
    </>
  );
};

export const WrongNetworkModal: React.SFC<WrongNetworkComponentProps> = props => {
  return (
    <Modal width={558}>
      <WrongNetworkComponent {...props} />
    </Modal>
  );
};
