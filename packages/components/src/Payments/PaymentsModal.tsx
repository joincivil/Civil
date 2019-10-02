import * as React from "react";
import { PaymentsModalContain, PaymentsModalCloseBtn } from "./PaymentsStyledComponents";
import { FullScreenModal } from "../FullscreenModal";
import { CloseXIcon } from "../icons";
import { colors } from "../styleConstants";

export interface PaymentsModalProps {
  open: boolean;
  children: any;
  className?: string;
  handleClose?(): void;
}

export const PaymentsModal: React.FunctionComponent<PaymentsModalProps> = props => {
  return (
    <>
      <FullScreenModal open={props.open}>
        <PaymentsModalContain className={props.className}>
          {props.handleClose && (
            <PaymentsModalCloseBtn onClick={() => props.handleClose && props.handleClose()}>
              <CloseXIcon color={colors.accent.CIVIL_GRAY_2} width={32} height={32} />
            </PaymentsModalCloseBtn>
          )}
          {props.children}
        </PaymentsModalContain>
      </FullScreenModal>
    </>
  );
};
