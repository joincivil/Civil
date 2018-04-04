import * as React from "react";
import * as ReactDom from "react-dom";
// tslint:disable-next-line
import styled, {StyledComponentClass} from "styled-components";
import { colorConstants } from "../../colorConstants";

const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const ModalInner = styled.div`
  min-width: 250px;
  background-color: ${colorConstants.WHITE};
  border: 1px solid ${colorConstants.ACCENT_FADED_GREY};
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-family: "Libre Franklin", sans-serif;
`;

export const FormGroup = styled.div`
  padding: 10px;
  display: block;
  padding: 20px 20px 5px 20px;
  margin: auto;
`;

export const Label = styled.label`
  margin-right: 10px;
`;

export const ButtonZone = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Button = styled.button`
  border: none;
  min-width: 100px;
  font-size: 16px;
  background-color: ${colorConstants.PRIMARY_BLUE};
  padding: 10px 20px;
  margin: 15px 10px;
  color: ${colorConstants.WHITE};
  border-radius: 1px;
  cursor: pointer;
  &:hover{
    background-color: ${colorConstants.ACCENT_BLUE};
  }
`;

export const SecondaryButton = Button.extend`
  background-color: ${colorConstants.ACCENT_GREY};
  &:hover{
    background-color: ${colorConstants.ACCENT_FADED_GREY};
  }
`;

export const Input = styled.input`
  width: 300px;
`;

export interface ModalProps {
  children: JSX.Element | JSX.Element[];
}

export class Modal extends React.Component<any, any> {
  public el: HTMLDivElement;

  constructor(props: any) {
    super(props);
    this.el = document.createElement("div");
  }
  public componentDidMount(): void {
    document.body.appendChild(this.el);
  }
  public componentWillUnmount(): void {
    document.body.removeChild(this.el);
  }
  public render(): React.ReactPortal | JSX.Element {
    return ReactDom.createPortal(
      <ModalWrapper>{this.props.children}</ModalWrapper>,
      this.el,
    );
  }
}
