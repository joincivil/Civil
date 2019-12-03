import * as React from "react";
import { PaymentFullscreenModal, PaymentModalContain, PaymentModalCloseBtn } from "./PaymentsStyledComponents";
import { CloseXIcon } from "../icons";
import { colors } from "../styleConstants";

export interface PaymentsModalProps {
  open: boolean;
  children: any;
  handleClose?(): void;
}

export const PaymentsModal: React.FunctionComponent<PaymentsModalProps> = props => {
  const maxHeight = window.innerHeight - 200;
  return (
    <>
      <PaymentFullscreenModal open={props.open}>
        {/*iframe resizer used by embed looks for elements with `data-iframe-height` attribute and expands to fit even if they extend outside of `<body>` which this does*/}
        <PaymentModalContain maxHeight={maxHeight} data-iframe-height>
          {props.handleClose && (
            <PaymentModalCloseBtn onClick={() => props.handleClose && props.handleClose()}>
              <CloseXIcon color={colors.accent.CIVIL_GRAY_2} width={32} height={32} />
            </PaymentModalCloseBtn>
          )}
          {props.children}
        </PaymentModalContain>
      </PaymentFullscreenModal>
    </>
  );
};
