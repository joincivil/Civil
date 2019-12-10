import * as React from "react";
import { InvertedButton, BorderlessButton, buttonSizes } from "../Button";
import { Modal } from "../Modal";
import { colors, fonts } from "../styleConstants";
import styled from "styled-components";
import Dropzone from "react-dropzone";

export interface ImageFileToDataUriState {
  modalOpen: boolean;
  error?: string;
}

export interface ImageFileToDataUriProps {
  buttonText?: string;
  maxBytes?: number;
  maxSizeText?: string;
  info?: string;
  onChange(dataUri: string): void;
}
export interface ImageFileToDataUriDefaultProps {
  maxBytes: number;
  maxSizeText: string;
  info: string;
}

const DropArea = styled.div`
  cursor: pointer;
  outline: none;
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
  &:hover {
    border-color: ${colors.primary.CIVIL_BLUE_1};
  }
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

const Error = styled.p`
  color: ${colors.accent.CIVIL_RED};
`;

export class ImageFileToDataUri extends React.Component<
  ImageFileToDataUriProps & ImageFileToDataUriDefaultProps,
  ImageFileToDataUriState
> {
  public static defaultProps: ImageFileToDataUriDefaultProps = {
    maxBytes: 256 * 1024,
    maxSizeText: "250KB",
    info: "Recommended dimensions 260x260px, maximum file size 250KB. Image will be displayed constrained to a square.",
  };

  constructor(props: ImageFileToDataUriProps & ImageFileToDataUriDefaultProps) {
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
        <p>{this.props.info}</p>
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
        {this.state.error && <Error>{this.state.error}</Error>}
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
          {this.props.buttonText || "Add Image"}{" "}
        </InvertedButton>
        {this.renderModal()}
      </>
    );
  }

  private createDataUrlFromFile = (acceptedFiles: any) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const dataUri = event.target!.result;
      // Image data URI lengths are 1/3 longer than number of bytes in image file, don't know exactly why but tested for jpgs gifs and pngs of various sizes and it's spot on so divide by 4/3 to get bytes.
      const fileSize = dataUri && dataUri.length / (4 / 3);
      if (fileSize && fileSize > this.props.maxBytes) {
        this.setState({
          error: `Uploaded image is ${Math.round(fileSize / 1024)}KB, which is too large. Max size: ${
            this.props.maxSizeText
          }`,
        });
        return;
      }
      this.props.onChange(dataUri);
      this.setState({ modalOpen: false, error: undefined });
    };
    reader.readAsDataURL(acceptedFiles[0]);
  };
}
