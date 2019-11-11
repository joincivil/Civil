import * as React from "react";
import { PaymentModalContain, PaymentModalCloseBtn } from "./PaymentsStyledComponents";
import { FullScreenModal } from "../FullscreenModal";
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
      <FullScreenModal open={props.open}>
        <PaymentModalContain maxHeight={maxHeight}>
          {props.handleClose && (
            <PaymentModalCloseBtn onClick={() => props.handleClose && props.handleClose()}>
              <CloseXIcon color={colors.accent.CIVIL_GRAY_2} width={32} height={32} />
            </PaymentModalCloseBtn>
          )}
          {props.children}
        </PaymentModalContain>
      </FullScreenModal>
    </>
  );
};
