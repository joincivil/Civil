import { storiesOf } from "@storybook/react";
import * as React from "react";
import { MetaMaskModal } from "./MetaMaskModal";
import { ModalHeading } from ".";
import styled from "styled-components";

const func = () => {
  return;
};

storiesOf("MetaMaskModal", module)
  .add("preMetaMaskModal", () => {
    return process.env.NODE_ENV !== "test" ? (
      <MetaMaskModal cancelTransaction={func} startTransaction={func} waiting={false}>
        <ModalHeading>test</ModalHeading>
      </MetaMaskModal>
    ) : (
      <div> test </div>
    );
  })
  .add("waitingMetaMaskModal", () => {
    return process.env.NODE_ENV !== "test" ? (
      <MetaMaskModal cancelTransaction={func} startTransaction={func} waiting={true}>
        <ModalHeading>test</ModalHeading>
      </MetaMaskModal>
    ) : (
      <div> test </div>
    );
  })
  .add("deniedMetaMaskModal", () => {
    return process.env.NODE_ENV !== "test" ? (
      <MetaMaskModal
        denialText={"something something something"}
        cancelTransaction={func}
        startTransaction={func}
        waiting={false}
        denied={true}
      >
        <ModalHeading>test</ModalHeading>
      </MetaMaskModal>
    ) : (
      <div> test </div>
    );
  })
  .add("SignatureMetaMaskModal", () => {
    return process.env.NODE_ENV !== "test" ? (
      <MetaMaskModal cancelTransaction={func} startTransaction={func} waiting={false} signing={true}>
        <ModalHeading>test</ModalHeading>
      </MetaMaskModal>
    ) : (
      <div> test </div>
    );
  })
  .add("SignatureMetaMaskModal waiting", () => {
    return process.env.NODE_ENV !== "test" ? (
      <MetaMaskModal cancelTransaction={func} startTransaction={func} waiting={true} signing={true}>
        <ModalHeading>test</ModalHeading>
      </MetaMaskModal>
    ) : (
      <div> test </div>
    );
  });
