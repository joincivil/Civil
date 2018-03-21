import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { InsertLink } from "material-ui-icons";
import { Modal, ModalInner, Input, FormGroup, Label, Button } from "./Modal";

export interface LinkProps {
  editor: any;
  mark: any;
  node: any;
  offset: number;
  text: string;
}

export interface LinkState {
  dialogueOpen: boolean;
  address: string;
}

export const LinkElement = styled.a`
  text-decoration: none;
  color: #5a5653;
  border-bottom: 2px solid #30E8BD;
  cursor: pointer;
  &:hover{
    border-bottom: 2px solid #97F3DE;
  }
  &:visited{
    border-bottom: 2px solid #4066FF;
  }
`;

export const LinkIcon = styled.span`
  width:0;
  overflow: visible;
  display: inline;
  margin-left: -8px;
  margin-right: -12px;
  cursor: pointer;
  & svg {
    position: relative;
    width: 20px;
    height: 20px;
    top: -8px;
  }
  & path {
    stroke: #2B56FF;
    fill: #2B56FF;
  }
`;

export class Link extends React.Component<LinkProps, LinkState> {
  constructor(props: LinkProps) {
    super(props);
    this.state = {
      dialogueOpen: !this.props.mark.data.get("href"),
      address: this.props.mark.data.get("href") || "",
    };
  }
  public clickLinkEdit(e: any): void {
    if (this.props.editor.props.readOnly) {
      return;
    }
    e.preventDefault();
    this.setState({
      dialogueOpen: true,
    });
  }
  public updateAddress(e: any): void {
    this.setState({
      address: e.target.value,
    });
  }
  public setAddress(e: any): void {
    this.setState({
      dialogueOpen: false,
    });
    this.props.editor.change((change: any): void => {
      change.setMarkByKey(
        this.props.node.key,
        this.props.offset,
        this.props.text.length,
        this.props.mark,
        {
          data: {href: this.state.address},
        },
      );
    });
  }
  public render(): JSX.Element {
    let linkEditButton = null;
    let linkEditModal = null;
    if (!this.props.editor.props.readOnly) {
      linkEditButton = <LinkIcon><InsertLink/></LinkIcon>;
      if (this.state.dialogueOpen) {
        linkEditModal = (<Modal>
          <ModalInner>
            <FormGroup>
              <Label>Text</Label>
              <Input type="text" disabled={true} value={`${this.props.children}`}/>
            </FormGroup>
            <FormGroup>
              <Label>Link</Label>
              <Input
                type="text"
                value={this.state.address}
                onChange={(e: any): void => this.updateAddress(e)}
               />
            </FormGroup>
            <Button onClick={(e: any): void => this.setAddress(e)}>Apply</Button>
          </ModalInner>
        </Modal>);
      }
    }
    return (<>
      <LinkElement
        onClick={(e: any) => this.clickLinkEdit(e)}
        href={this.props.mark.data.get("href")}
        target="_blank"
        {...this.props}
      >
        {this.props.children}
        {linkEditButton}
      </LinkElement>
      {linkEditModal}
    </>);
  }
}
