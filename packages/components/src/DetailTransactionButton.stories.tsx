import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { DetailTransactionButton } from "./DetailTransactionButton";
import { Modal } from "./Modal";
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
      <Modal>
        <h3>Hello</h3>
        <p>lorem ipsum whatever you know what i mean. It gets pretty long because thats more useful</p>
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
