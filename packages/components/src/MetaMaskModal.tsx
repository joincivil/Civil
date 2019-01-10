import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import {
  Modal,
  BorderlessButton,
  ClipLoader,
  TransactionButtonNoModal,
  Transaction,
  MetaMaskSideIcon,
  MetaMaskLogoButton,
} from ".";
import * as metaMaskModalUrl from "./images/img-metamask-modalconfirm@2x.png";
import * as confirmButton from "./images/img-metamask-confirm@2x.png";
import * as signImage from "./images/img-metamaskmodal-new-signature.png";

const ModalP = styled.p`
  font-size: 16px;
  color: #5f5f5f;
  line-height: 26px;
`;

const HalfPWrapper = styled.div`
  width: 55%;
`;

const MainImg = styled.img`
  width: 40%;
  height: 240px;
  object-fit: cover;
`;

export interface ContentSectionWrapperProps {
  row?: boolean;
}

export const MetaMaskStepCounter: StyledComponentClass<any, "div"> = styled.div`
  font-weight: 600;
`;

const ContentSectionWrapper = styled.div`
  display: flex;
  flex-direction: ${(props: ContentSectionWrapperProps) => (props.row ? "row" : "column")};
  justify-content: space-between;
  margin-top: -20px;
`;

const IB = styled(BorderlessButton)`
  font-weight: 400;
  margin-right: 30px;
`;

const ImgWrapperSmall = styled.span`
  border-radius: 2px;
  padding: 4px 5px 1px 5px;
  border: 1px solid #dddddd;
  display: inline-blocks;
  vertical-align: middle;
`;

const ImgWrapperFull = styled.div`
  text-align: center;
  line-height: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 19px 24px;
  margin: 0 -25px;
  border-top: 1px solid #dddddd;
  margin-top: -1px;
`;

const WaitingButton = styled.div`
  border: 1px solid #dddddd;
  padding: 12px 23px;
  color: #5f5f5f;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const SpanWithMargin = styled.span`
  margin-right: 10px;
  font-weight: 600;
  font-size: 14px;
`;

export interface MetaMaskModalProps {
  waiting: boolean;
  denied?: boolean;
  signing?: boolean;
  ipfsPost?: boolean;
  bodyText?: string;
  denialText?: string;
  denialRestartTransactions?: Transaction[];
  cancelTransaction?(): void;
  startTransaction?(): void;
}

export const MetaMaskModal: React.StatelessComponent<MetaMaskModalProps> = props => {
  let buttonSection;
  if (props.ipfsPost) {
  } else if (!props.waiting) {
    buttonSection = (
      <ButtonContainer>
        <IB onClick={props.cancelTransaction}>Cancel</IB>
        {props.denied ? (
          <TransactionButtonNoModal transactions={props.denialRestartTransactions!} Button={MetaMaskLogoButton}>
            {" "}
            Try Again{" "}
          </TransactionButtonNoModal>
        ) : (
          <MetaMaskLogoButton onClick={props.startTransaction!}>Open MetaMask</MetaMaskLogoButton>
        )}
      </ButtonContainer>
    );
  } else {
    buttonSection = (
      <ButtonContainer>
        <WaitingButton>
          <SpanWithMargin>Waiting for confirmation</SpanWithMargin>
          <ClipLoader size={19} />
        </WaitingButton>
      </ButtonContainer>
    );
  }
  let paragraph;
  if (props.ipfsPost) {
    paragraph = <ModalP>Your statement is being uploaded to IPFS</ModalP>;
  } else if (props.signing) {
    paragraph = !props.waiting ? (
      <ModalP>{props.bodyText || "MetaMask will open a new window and request a signature."}</ModalP>
    ) : (
      <ModalP>
        You need to sign this message in your wallet. MetaMask will open a new window to confirm. If you don't see it,
        please click the icon{" "}
        <ImgWrapperSmall>
          <MetaMaskSideIcon />
        </ImgWrapperSmall>{" "}
        in the browser bar.
      </ModalP>
    );
  } else {
    paragraph = !props.waiting ? (
      <ModalP>
        {props.bodyText || "MetaMask will open a new window for you to confirm this transaction with your wallet."}
      </ModalP>
    ) : (
      <ModalP>
        This transaction needs to be confirmed in your wallet. MetaMask will open a new window for you to confirm. If
        you don't see it, please click the MetaMask{" "}
        <ImgWrapperSmall>
          <MetaMaskSideIcon />
        </ImgWrapperSmall>{" "}
        in the browser bar.
      </ModalP>
    );
  }

  if (props.denied) {
    paragraph = (
      <HalfPWrapper>
        <ModalP>You have canceled this transaction in your wallet.</ModalP>
        {!!props.denialText && <ModalP>{props.denialText}</ModalP>}
      </HalfPWrapper>
    );
  }

  let image;
  if (props.denied) {
    image = <MainImg src={confirmButton} />;
  } else {
    image = (
      <ImgWrapperFull>
        <img width={512} height={248} src={props.signing ? signImage : metaMaskModalUrl} />
      </ImgWrapperFull>
    );
  }

  return (
    <Modal width={560} padding={"8px 26px 0 26px"}>
      {props.children}
      <ContentSectionWrapper row={props.denied}>
        {paragraph}
        {image}
      </ContentSectionWrapper>
      {buttonSection}
    </Modal>
  );
};
