import * as React from "react";
import styled from "styled-components";
import { colors } from "./styleConstants";
import { SecondaryButton, buttonSizes } from "./Button";

export interface AddressWithCopyButtonProps {
  address?: string;
}

const Box = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  border-right: none;
  background-color: ${colors.basic.WHITE};
  padding: 9px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - 21px);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin-bottom: 10px;
`;

const Button = styled(SecondaryButton)`
  padding: 10px;
  font-size: 14px;
`;

export class AddressWithCopyButton extends React.Component<AddressWithCopyButtonProps> {
  public addressBox?: HTMLDivElement;
  public render(): JSX.Element {
    return (
      <Wrapper>
        <Box ref={(el: HTMLDivElement) => (this.addressBox = el)}>{this.props.address}</Box>
        <Button size={buttonSizes.SMALL} onClick={this.copy}>
          Copy
        </Button>
      </Wrapper>
    );
  }
  private copy = (): void => {
    const el: HTMLTextAreaElement = document.createElement("textarea");
    el.value = this.addressBox!.textContent!;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };
}
