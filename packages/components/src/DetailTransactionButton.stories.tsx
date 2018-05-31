import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { DetailTransactionButton } from "./DetailTransactionButton";
import { Modal } from "./Modal";
import { ModalContent, ModalHeading } from "./ModalContent";
import { LoadingIndicator } from "./LoadingIndicator";
import { Civil, TwoStepEthTransaction } from "@joincivil/core";

let civil: Civil | undefined;

try {
  civil = new Civil();
} catch (error) {
  civil = undefined;
}

const createNewsroom = async (): Promise<TwoStepEthTransaction<any>> => {
  return civil!.newsroomDeployNonMultisigTrusted("hello");
};

let isTransactionProgressModalVisible = false;
function toggleProgressModal(): void {
  isTransactionProgressModalVisible = !isTransactionProgressModalVisible;
}

const Wrapper = styled.div`
  margin: 50px;
  max-width: 500px;
`;

storiesOf("DetailTransactionButton", module)
  .add("detail transaction button", () => {
    return (
      <Wrapper>
        <DetailTransactionButton
          civil={civil}
          transactions={[
            { transaction: createNewsroom, preTransaction: toggleProgressModal, postTransaction: toggleProgressModal },
          ]}
          estimateFunctions={[civil!.estimateNewsroomDeployTrusted.bind(civil, "some name")]}
          requiredNetwork="rinkeby"
        >
          Create Newsroom
        </DetailTransactionButton>
      </Wrapper>
    );
  })
  .add("detail transaction button with visible progress modal", () => {
    const progressModal = (
      <Modal textAlign="center">
        <LoadingIndicator height={100} />
        <ModalHeading>Your transaction is in progress.</ModalHeading>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </Modal>
    );

    return (
      <Wrapper>
        <DetailTransactionButton
          civil={civil}
          transactions={[
            { transaction: createNewsroom, preTransaction: toggleProgressModal, postTransaction: toggleProgressModal },
          ]}
          estimateFunctions={[civil!.estimateNewsroomDeployTrusted.bind(civil, "some name")]}
          requiredNetwork="rinkeby"
          progressModal={progressModal}
        >
          Create Newsroom
        </DetailTransactionButton>
      </Wrapper>
    );
  });
