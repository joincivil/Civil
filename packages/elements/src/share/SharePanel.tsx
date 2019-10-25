import * as React from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import { colors } from "../colors";
import { CloseXButton } from "../buttons";
import { mediaQueries } from "../containers";

const SharePanelOuter = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  overflow: auto;
  right: 0;
  top: 74px;
  z-index: 3;

  &.share-enter > div {
    transform: translate(100%, 0);
  }
  &.share-enter-active > div {
    transform: translate(0);
    transition: transform 300ms;
  }
  &.share-exit > div {
    transform: translate(0);
  }
  &.share-exit-active > div {
    transform: translate(100%, 0);
    transition: transform 300ms;
  }

  ${mediaQueries.MOBILE} {
    top: 54px;
  }

  ${mediaQueries.MOBILE_SMALL} {
    align-items: flex-end;

    &.share-enter > div {
      transform: translate(0, 100%);
    }
    &.share-enter-active > div {
      transform: translate(0);
      transition: transform 300ms;
    }
    &.share-exit > div {
      transform: translate(0);
    }
    &.share-exit-active > div {
      transform: translate(0, 100%);
      transition: transform 300ms;
    }
  }
`;
const SharePanelInner = styled.div`
  background-color: ${colors.basic.WHITE};
  padding: 20px;
  overflow: auto;
  width: 360px;

  ${mediaQueries.MOBILE_SMALL} {
    bottom: 0;
    right: 0;
    position: fixed;
    width: 100%;
  }
`;

const SharePanelClose = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
`;

export interface SharePanelProps {
  open: boolean;
  handleClose?(): void;
}

export const SharePanel: React.FunctionComponent<SharePanelProps> = props => {
  return (
    <CSSTransition in={props.open} timeout={300} classNames="share" mountOnEnter unmountOnExit>
      <SharePanelOuter>
        <SharePanelInner>
          {props.handleClose && (
            <SharePanelClose>
              <CloseXButton onClick={props.handleClose} />
            </SharePanelClose>
          )}
          {props.children}
        </SharePanelInner>
      </SharePanelOuter>
    </CSSTransition>
  );
};
