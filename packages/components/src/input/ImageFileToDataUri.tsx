import * as React from "react";
import { InvertedButton, BorderlessButton, buttonSizes } from "../Button";
import { Modal } from "../Modal";
import { colors, fonts } from "../styleConstants";
import styled from "styled-components";
import Dropzone from "react-dropzone";

export interface ImageFileToDataUriState {
  modalOpen: boolean;
}

export interface ImageFileToDataUriProps {
  onChange(dataUri: string): void;
}

const DropArea = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 200px;
  border: 3px dashed ${colors.primary.CIVIL_GRAY_2};
  color: ${colors.primary.CIVIL_GRAY_2};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  p {
    font-size: 18px;
    font-family: ${fonts.SANS_SERIF};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 25px;
`;

export class ImageFileToDataUri extends React.Component<ImageFileToDataUriProps, ImageFileToDataUriState> {
  constructor(props: ImageFileToDataUriProps) {
    super(props);
    this.state = {
      modalOpen: false,
    };
  }
  public renderModal(): JSX.Element | null {
    if (!this.state.modalOpen) {
      return null;
    }
    return (
      <Modal>
        <Dropzone onDrop={this.createDataUrlFromFile}>
          {({ getRootProps, getInputProps }: any) => (
            <section>
              <DropArea {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drop files here, or click to select files</p>
              </DropArea>
            </section>
          )}
        </Dropzone>
        <ButtonContainer>
          <BorderlessButton size={buttonSizes.SMALL} onClick={() => this.setState({ modalOpen: false })}>
            Close
          </BorderlessButton>
        </ButtonContainer>
      </Modal>
    );
  }

  public render(): JSX.Element {
    return (
      <>
        <InvertedButton size={buttonSizes.SMALL} onClick={() => this.setState({ modalOpen: true })}>
          {" "}
          Add Image{" "}
        </InvertedButton>
        {this.renderModal()}
      </>
    );
  }

  private createDataUrlFromFile = (acceptedFiles: any) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.props.onChange(event.target!.result);
      this.setState({ modalOpen: false });
    };
    reader.readAsDataURL(acceptedFiles[0]);
  };
}
