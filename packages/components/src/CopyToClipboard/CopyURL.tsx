import * as React from "react";
import { copyToClipboard } from "@joincivil/utils";
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

    return <CopyBtn onClick={(ev: any) => this.copy()}>{this.props.copyText || "Copy the URL"}</CopyBtn>;
  }

  private copy = () => {
    copyToClipboard(window.location.href);
    this.setState({
      copied: true,
    });
  };
}
