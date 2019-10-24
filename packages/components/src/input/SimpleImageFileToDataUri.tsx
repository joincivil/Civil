import * as React from "react";
import { InvertedButton, buttonSizes } from "../Button";
import { colors, fonts, mediaQueries } from "../styleConstants";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import { PhotoDragIcon } from "@joincivil/elements";

export interface SimpleImageFileToDataUriProps {
  buttonText?: string;
  onChange(dataUri: string): void;
}

const DropArea = styled.div`
  width: 336px;
  box-sizing: border-box;
  height: 336px;
  ${mediaQueries.MOBILE} {
    width: 200px;
    height: 200px;
  }
  background-color: #f9faff;
  border: 2px dashed ${colors.primary.CIVIL_BLUE_1};
  color: ${colors.primary.CIVIL_GRAY_2};
  border-radius: 168px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 30px;

  ${mediaQueries.MOBILE} {
    padding-left: 10px;
    padding-right: 10px;
  }
  p {
    font-size: 18px;
    font-family: ${fonts.SANS_SERIF};
  }
`;

const ImageSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 450px;
  ${mediaQueries.MOBILE} {
    height: 300px;
    width: 240px;
  }
`;

const DragAndDropText = styled.span`
  width: 300px;
  ${mediaQueries.MOBILE} {
    width: 150px;
  }
  text-align: center;
`;

export class SimpleImageFileToDataUri extends React.Component<SimpleImageFileToDataUriProps> {
  private readonly inputOpenFileRef: React.RefObject<HTMLInputElement>;

  constructor(props: SimpleImageFileToDataUriProps) {
    super(props);

    this.inputOpenFileRef = React.createRef();
  }

  public showOpenFileDlg = () => {
    this.inputOpenFileRef!.current!.click();
  };

  public renderDropZone(): JSX.Element | null {
    return (
      <>
        <Dropzone onDrop={this.createDataUrlFromFile}>
          {({ getRootProps, getInputProps }: any) => (
            <section>
              <DropArea {...getRootProps()}>
                <input {...getInputProps()} />
                <PhotoDragIcon />
                <br />
                <DragAndDropText>Drag and drop an image here</DragAndDropText>
              </DropArea>
            </section>
          )}
        </Dropzone>
      </>
    );
  }

  public render(): JSX.Element {
    return (
      <ImageSelectionContainer>
        {this.renderDropZone()}
        or
        <input
          ref={this.inputOpenFileRef}
          type="file"
          style={{ display: "none" }}
          onChange={this.createDataUrlFromFile2}
        />
        <InvertedButton size={buttonSizes.SMALL} onClick={() => this.showOpenFileDlg()}>
          {" "}
          {this.props.buttonText || "Upload Image"}{" "}
        </InvertedButton>
      </ImageSelectionContainer>
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

  private createDataUrlFromFile2 = (e: any) => {
    this.props.onChange(e.target.files[0]);
  };
}
