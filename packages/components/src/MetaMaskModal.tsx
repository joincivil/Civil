import * as React from "react";
import styled from "styled-components";
import {
  Modal,
  BorderlessButton,
  Button,
  buttonSizes,
  ClipLoader,
  TransactionButtonNoModal,
  Transaction,
  TransactionButtonInnerProps,
  MetaMaskSideIcon,
} from ".";
import * as metaMaskModalUrl from "./images/img-metamask-modalconfirm.png";
import * as confirmButton from "./images/img-metamask-confirm@2x.png";

const ModalP = styled.p`
  font-size: 18px;
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

const ContentSectionWrapper = styled.div`
  display: flex;
  flex-direction: ${(props: ContentSectionWrapperProps) => (props.row ? "row" : "column")};
  justify-content: space-between;
`;

const B = Button.extend`
  position: relative;
  display: flex;
  align-items: center;
  height: 46px;
  padding-left: 75px;
`;

const IB = BorderlessButton.extend`
  font-weight: 400;
  margin-right: 30px;
`;

const ImgWrapper = styled.div`
  width: 44px;
  height: 44px;
  background-color: #ffffff;
  position: absolute;
  top: 1px;
  left: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImgWrapperSmall = styled.span`
  border-radius: 2px;
  padding: 4px 5px 1px 5px;
  border: 1px solid #dddddd;
  display: inline-blocks;
  vertical-align: middle;
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
  denialText?: string;
  denialRestartTransactions?: Transaction[];
  cancelTransaction?(): void;
  startTransaction?(): void;
}

const PrimaryButton = (props: TransactionButtonInnerProps): JSX.Element => {
  return (
    <B onClick={props.onClick} size={buttonSizes.MEDIUM_WIDE}>
      <ImgWrapper>
        <MetaMaskSideIcon />
      </ImgWrapper>
      {props.children}
    </B>
  );
};

export const MetaMaskModal: React.StatelessComponent<MetaMaskModalProps> = props => {
  const buttonSection = !props.waiting ? (
    <ButtonContainer>
      <IB onClick={props.cancelTransaction}>Cancel</IB>
      {props.denied ? (
        <TransactionButtonNoModal transactions={props.denialRestartTransactions!} Button={PrimaryButton}>
          {" "}
          Try Again{" "}
        </TransactionButtonNoModal>
      ) : (
        <PrimaryButton onClick={props.startTransaction!}>Open MetaMask</PrimaryButton>
      )}
    </ButtonContainer>
  ) : (
    <ButtonContainer>
      <WaitingButton>
        <SpanWithMargin>Waiting for confirmation</SpanWithMargin>
        <ClipLoader size={19} />
      </WaitingButton>
    </ButtonContainer>
  );

  let paragraph = !props.waiting ? (
    <ModalP> MetaMask will open a new window for you to confirm this transaction with your wallet.</ModalP>
  ) : (
    <ModalP>
      You need to confirm this transaction in your wallet. MetaMask will open a new window to confirm. If you don't see
      it, please click the icon{" "}
      <ImgWrapperSmall>
        <MetaMaskSideIcon />
      </ImgWrapperSmall>{" "}
      in the browser bar.
    </ModalP>
  );

  if (props.denied) {
    paragraph = (
      <HalfPWrapper>
        <ModalP>You have canceled this transaction in your wallet.</ModalP>
        {!!props.denialText && <ModalP>{props.denialText}</ModalP>}
      </HalfPWrapper>
    );
  }

  const image = props.denied ? <MainImg src={confirmButton} /> : <img src={metaMaskModalUrl} />;

  return (
    <Modal width={560} padding={"32px 26px 0 26px"}>
      {props.children}
      <ContentSectionWrapper row={props.denied}>
        {paragraph}
        {image}
      </ContentSectionWrapper>
      {buttonSection}
    </Modal>
  );
};
