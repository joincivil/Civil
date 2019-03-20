import * as React from "react";
import { FAQ_BASE_URL, urlConstants } from "@joincivil/utils";
import * as metaMaskNetworkSwitchUrl from "../images/img-metamask-networkswitch@2x.png";
import { Modal } from "../Modal";
import { MetaMaskMockImage, MetaMaskIcon, StyledLargeModalText, StyledSmallModalText } from "./styledComponents";

export interface WrongNetworkComponentProps {
  requiredNetworkNiceName: string;
}

export const WrongNetworkComponent: React.SFC<WrongNetworkComponentProps> = props => {
  return (
    <>
      <StyledLargeModalText>
        <b>Change your network.</b> Looks like you’re using an unsupported Ethereum network. Make sure you're using the{" "}
        <b>{props.requiredNetworkNiceName}</b>.
      </StyledLargeModalText>
      <StyledSmallModalText>
        <a href={`${FAQ_BASE_URL}${urlConstants.FAQ_SWITCH_NETWORKS}`} target="_blank">
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
