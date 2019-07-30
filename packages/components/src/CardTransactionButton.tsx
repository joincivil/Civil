import * as React from "react";
import { CardClickable } from "./Card";
import { TransactionButtonInnerProps } from "./TransactionButton";
import styled from "styled-components";

export const CardTransactionButton = (props: TransactionButtonInnerProps): JSX.Element => {
  return (
    <CardClickable onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </CardClickable>
  );
};
