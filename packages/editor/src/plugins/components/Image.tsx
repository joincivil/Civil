import * as React from "react";
// tslint:disable-next-line
import styled, { StyledComponentClass } from "styled-components";
import { constants } from "../index";

const ImageInline = styled.img`
  width: 100%;
  margin: 30px 0;
`;

const ImageBreakout = styled.img`
  width: 90vw;
  left: calc(-220px + calc(calc(805px - 90vw) / 2));
  margin: 30px 0;
  position: relative;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

// TODO add image toggles

// const ImageToggleWrapper = styled.div`
//   width: 50px;
//   position: absolute;
//   margin-left: -25px;
//   top: 10px;
//   left: 50%;
//   display: flex;
//   justify-content: start;
//   align-items: center;
// `;

export interface ImageProps {
  node: any;
  editor: any;
}

export interface ImageState {
  src: string;
}

export class Image extends React.Component<ImageProps, ImageState> {
  constructor(props: ImageProps) {
    super(props);
    this.state = {
      src: "",
    };
  }
  public componentDidMount(): void {
    this.divineSrc();
  }
  public divineSrc(): void {
    if (this.props.node.data.get("src")) {
      this.setState({
        src: this.props.node.data.get("src"),
      });
    } else if (this.props.node.data.get("file")) {
      const reader = new FileReader();
      reader.onload = (e: any): void => {
        this.setState({
          src: e.target.result,
        });
      };
      reader.readAsDataURL(this.props.node.data.get("file"));
    }
  }
  public setBlock(type: string): void {
    // TODO make switching between image types work
    this.props.editor.change((change: any): void => {
      change.setNodeByKey(this.props.node.key, "paragraph");
    });
  }
  public render(): JSX.Element {
    const toggle = null;
    if (!this.props.editor.props.readOnly) {
      // TODO: make toggling image types work
      // toggle = (<ImageToggleWrapper>
      //   <button onClick={() => this.setBlock(constants.IMAGE)}>n</button>
      //   <button onClick={() => this.setBlock(constants.IMAGE_BREAKOUT)}>w</button>
      // </ImageToggleWrapper>);
    }
    if (this.props.node.data.get("style") === constants.IMAGE) {
      return (
        <ImageWrapper>
          <ImageInline src={this.state.src} />
          {toggle}
        </ImageWrapper>
      );
    } else {
      return (
        <ImageWrapper>
          <ImageBreakout src={this.state.src} />
          {toggle}
        </ImageWrapper>
      );
    }
  }
}
