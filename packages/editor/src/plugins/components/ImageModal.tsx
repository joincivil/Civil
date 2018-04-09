import * as React from "react";
// tslint:disable-next-line
import styled, { StyledComponentClass } from "styled-components";
import { Modal, ModalInner, FormGroup, Label, Input, Button } from "./Modal";

export interface ImageModalState {
  imageUrl: string;
  imageFullWidth: boolean;
}

export interface ImageModalProps {
  applyChange(changes: ImageModalState): void;
}

export class ImageModal extends React.Component<ImageModalProps, ImageModalState> {
  constructor(props: ImageModalProps) {
    super(props);
    this.state = {
      imageUrl: "",
      imageFullWidth: false,
    };
  }
  public imageWidthUpdate(e: any): void {
    this.setState({
      imageFullWidth: !this.state.imageFullWidth,
    });
  }
  public imageUrlUpdate(e: any): void {
    this.setState({
      imageUrl: e.target.value,
    });
  }
  public applyChange(): void {
    this.props.applyChange({ ...this.state });
  }
  public render(): JSX.Element {
    return (
      <Modal>
        <ModalInner>
          <FormGroup>
            <Label>Image URL</Label>
            <Input type="text" value={this.state.imageUrl} onChange={(e: any): void => this.imageUrlUpdate(e)} />
          </FormGroup>
          <FormGroup>
            <Label>Full Width</Label>
            <Input
              value="fullWidth"
              defaultChecked={this.state.imageFullWidth}
              onChange={(e: any): void => this.imageWidthUpdate(e)}
              type="checkbox"
            />
          </FormGroup>
          <Button onClick={(): void => this.applyChange()}>Apply</Button>
        </ModalInner>
      </Modal>
    );
  }
}
