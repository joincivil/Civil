import * as React from "react";
import { urlConstants } from "@joincivil/utils";
import * as metaMaskNetworkSwitchUrl from "../images/img-metamask-networkswitch@2x.png";
import { Modal } from "../Modal";
import { MetaMaskMockImage, MetaMaskIcon, StyledLargeModalText, StyledSmallModalText } from "./styledComponents";

export interface WrongNetworkComponentProps {
  requiredNetworkNiceName: string;
}

export const WrongNetworkComponent: React.FunctionComponent<WrongNetworkComponentProps> = props => {
  return (
    <>
      <StyledLargeModalText>
        <b>Change your network.</b> Looks like you’re using an unsupported Ethereum network. Make sure you're using the{" "}
        <b>{props.requiredNetworkNiceName}</b>.
      </StyledLargeModalText>
      <StyledSmallModalText>
        <a href={urlConstants.FAQ_SWITCH_NETWORKS} target="_blank">
          Read this tutorial
        </a>{" "}
        to switch networks in MetaMask <MetaMaskIcon />
      </StyledSmallModalText>
      <MetaMaskMockImage src={metaMaskNetworkSwitchUrl} />
    </>
  );
};

export const WrongNetworkModal: React.FunctionComponent<WrongNetworkComponentProps> = props => {
  return (
    <Modal width={558}>
      <WrongNetworkComponent {...props} />
    </Modal>
  );
};
