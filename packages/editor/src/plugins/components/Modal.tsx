import * as React from "react";
import * as ReactDom from "react-dom";
import styled, {StyledComponentClass} from "styled-components";

const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const ModalInner = styled.div`
  min-width: 250px;
  background-color: #fff;
  border: 1px solid #E9E9EA;
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

export const Button = styled.button`
  border: none;
  font-size: 16px;
  background-color: #2B56FF;
  padding: 10px 20px;
  margin-top: 15px;
  margin-bottom: 15px;
  color: #fff;
  border-radius: 1px;
  cursor: pointer;
  &:hover{
    background-color: #4066FF;
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
