import * as React from "react";
import { BoostModalContain, BoostModalCloseBtn } from "./BoostStyledComponents";
import { colors, FullScreenModal, CloseXIcon } from "@joincivil/components";

export interface BoostModalProps {
  open: boolean;
  children: any;
  handleClose(): void;
}

export const BoostModal: React.FunctionComponent<BoostModalProps> = props => {
  return (
    <>
      <FullScreenModal open={props.open}>
        <BoostModalContain>
          <BoostModalCloseBtn onClick={() => props.handleClose()}>
            <CloseXIcon color={colors.accent.CIVIL_GRAY_2} />
          </BoostModalCloseBtn>
          {props.children}
        </BoostModalContain>
      </FullScreenModal>
    </>
  );
};
