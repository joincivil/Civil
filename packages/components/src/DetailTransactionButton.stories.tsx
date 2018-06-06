import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { DetailTransactionButton } from "./DetailTransactionButton";
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

const Wrapper = styled.div`
  margin: 50px;
  max-width: 500px;
`;

storiesOf("DetailTransactionButton", module)
  .add("detail transaction button", () => {
    return (
      <Wrapper>
        {process.env.NODE_ENV !== "test" && <DetailTransactionButton
          civil={civil}
          transactions={[{ transaction: createNewsroom }]}
          estimateFunctions={[civil!.estimateNewsroomDeployTrusted.bind(civil, "some name")]}
          requiredNetwork="rinkeby"
        >
          Create Newsroom
        </DetailTransactionButton>}
      </Wrapper>
    );
  })
  .add("detail transaction button with visible progress modal", () => {
    return (
      <Wrapper>
        {process.env.NODE_ENV !== "test" && <DetailTransactionButton
          civil={civil}
          transactions={[{ transaction: createNewsroom }]}
          estimateFunctions={[civil!.estimateNewsroomDeployTrusted.bind(civil, "some name")]}
          requiredNetwork="rinkeby"
        >
          Create Newsroom
        </DetailTransactionButton>}
      </Wrapper>
    );
  });
