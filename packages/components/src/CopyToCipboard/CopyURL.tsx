import * as React from "react";
import { CopyBtn, CopyURLSuccess } from "./CopyStyledComponents";
import { HollowGreenCheck } from "../icons";

export interface CopyURLProps {
  copyText?: string;
}

export interface CopyURLStates {
  copied: boolean;
}

export class CopyURL extends React.Component<CopyURLProps, CopyURLStates> {
  public constructor(props: CopyURLProps) {
    super(props);
    this.state = {
      copied: false,
    };
  }

  public render(): JSX.Element {
    if (this.state.copied) {
      return (
        <CopyURLSuccess>
          <HollowGreenCheck height={15} width={15} /> Copied
        </CopyURLSuccess>
      );
    }

    return <CopyBtn onClick={() => this.copyUrl}>{this.props.copyText || "Copy the URL"}</CopyBtn>;
  }

  private copyUrl = () => {
    const textArea = document.createElement("textarea");
    const currentURL = window.location.href;
    textArea.innerText = currentURL.replace(/ /g, "");
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();

    this.setState({
      copied: true,
    });
  };
}
