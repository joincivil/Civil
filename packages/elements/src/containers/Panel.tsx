import * as React from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import { colors } from "../colors";
import { CloseXButton } from "../buttons";
import { mediaQueries } from "./";

const PanelWrapper = styled.div`
  background-color: ${colors.basic.WHITE};
  border-left: 1px solid ${colors.accent.CIVIL_GRAY_4};
  box-shadow: 0 0 10px 0 rgba(0,0,0,0.35);
  bottom: 0;
  padding: 20px;
  position: fixed;
  overflow: auto;
  right: 0;
  top: 74px;
  width: 360px;
  z-index: 3;

  &.panel-enter {
    transform: translate(100%, 0);
  }
  &.panel-enter-active {
    transform: translate(0);
    transition: transform 300ms;
  }
  &.panel-exit {
    transform: translate(0);
  }
  &.panel-exit-active {
    transform: translate(100%, 0);
    transition: transform 300ms;
  }

  ${mediaQueries.MOBILE_SMALL} {
    border-left: none;
    border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
    width: 100%;

    &.panel-enter {
      transform: translate(0, 100%);
    }
    &.panel-enter-active {
      transform: translate(0);
      transition: transform 300ms;
    }
    &.panel-exit {
      transform: translate(0);
    }
    &.panel-exit-active {
      transform: translate(0, 100%);
      transition: transform 300ms;
    }
  }
`;

const PanelClose = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
`;

export interface PanelProps {
  open: boolean;
  handleClose?(): void;
}

export const Panel: React.FunctionComponent<PanelProps> = props => {
  return (
    <CSSTransition in={props.open} timeout={300} classNames="panel" unmountOnExit>
      <PanelWrapper>
        {props.handleClose && (
          <PanelClose>
            <CloseXButton onClick={props.handleClose} />
          </PanelClose>
        )}
        {props.children}
      </PanelWrapper>
    </CSSTransition>
  );
};
