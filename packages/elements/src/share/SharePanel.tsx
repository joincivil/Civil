import * as React from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import { colors } from "../colors";
import { CloseXButton } from "../buttons";
import { mediaQueries } from "../containers";

const SharePanelInner = styled.div`
  background-color: ${colors.basic.WHITE};
  opacity: 0;
  overflow: auto;
  padding: 10px 0;
  position: relative;
  width: 360px;

  ${mediaQueries.MOBILE_SMALL} {
    bottom: 0;
    right: 0;
    position: fixed;
    width: 100%;
  }
`;

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
  z-index: 4;

  &.share-enter > div {
    opacity: 0;
    transform: scale(0.9);
  }
  &.share-enter-active > div {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms, transform 300ms;
  }
  &.share-enter-done > div {
    opacity: 1;
  }
  &.share-exit > div {
    opacity: 1;
  }
  &.share-exit-active > div {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 300ms, transform 300ms;
  }

  ${mediaQueries.MOBILE} {
    top: 54px;
  }

  ${mediaQueries.MOBILE_SMALL} {
    align-items: flex-end;

    &.share-enter > div {
      opacity: 1;
      transform: translate(0, 100%) scale(1);
    }
    &.share-enter-active > div {
      transform: translate(0);
      transition: transform 300ms;
    }
    &.share-exit > div {
      transform: translate(0);
    }
    &.share-exit-active > div {
      opacity: 1;
      transform: translate(0, 100%) scale(1);
      transition: transform 300ms;
    }
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
