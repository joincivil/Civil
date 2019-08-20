import * as React from "react";
import { TransactionButtonInnerProps, MetaMaskLogoButton, buttonSizes, Button } from "@joincivil/components";

export const TransactionButtonInner: React.FunctionComponent<TransactionButtonInnerProps> = (
  props: TransactionButtonInnerProps,
): JSX.Element => {
  const B = props.step === 0 ? MetaMaskLogoButton : Button;
  return (
    <B onClick={props.onClick} disabled={props.disabled} size={buttonSizes.MEDIUM_WIDE}>
      {props.step === 1 && "Waiting for confirmation..."}
      {props.step === 2 && "Processing..."}
      {props.step === 0 && props.children}
    </B>
  );
};
