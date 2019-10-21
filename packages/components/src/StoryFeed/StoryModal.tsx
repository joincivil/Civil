import * as React from "react";
import { StoryModalContain, StoryModalCloseBtn } from "./StoryFeedStyledComponents";
import { FullScreenModal } from "../FullscreenModal";
import { CloseXButton } from "@joincivil/elements";

export interface StoryModalProps {
  open: boolean;
  children: any;
  handleClose?(): void;
}

export const StoryModal: React.FunctionComponent<StoryModalProps> = props => {
  const maxHeight = window.innerHeight - 200;
  return (
    <>
      <FullScreenModal open={props.open}>
        <StoryModalContain maxHeight={maxHeight}>
          {props.handleClose && (
            <StoryModalCloseBtn>
              <CloseXButton onClick={() => props.handleClose && props.handleClose()} />
            </StoryModalCloseBtn>
          )}
          {props.children}
        </StoryModalContain>
      </FullScreenModal>
    </>
  );
};
