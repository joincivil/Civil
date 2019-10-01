import * as React from "react";
import { StoryModalContain, StoryModalCloseBtn } from "./StoryFeedStyledComponents";
import { FullScreenModal } from "../FullscreenModal";
import { CloseXIcon } from "../icons";
import { colors } from "../styleConstants";

export interface StoryModalProps {
  open: boolean;
  children: any;
  className?: string;
  handleClose?(): void;
}

export const StoryModal: React.FunctionComponent<StoryModalProps> = props => {
  return (
    <>
      <FullScreenModal open={props.open}>
        <StoryModalContain className={props.className}>
          {props.handleClose && (
            <StoryModalCloseBtn onClick={() => props.handleClose && props.handleClose()}>
              <CloseXIcon color={colors.accent.CIVIL_GRAY_2} width={32} height={32} />
            </StoryModalCloseBtn>
          )}
          {props.children}
        </StoryModalContain>
      </FullScreenModal>
    </>
  );
};
