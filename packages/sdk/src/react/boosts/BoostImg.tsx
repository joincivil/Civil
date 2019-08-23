import * as React from "react";
import { defaultNewsroomImgUrl } from "@joincivil/components";
import * as IPFS from "ipfs-http-client";
import { promisify } from "@joincivil/utils";

const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const ipfsAsync = {
  get: promisify<[{ path: string; content: Buffer }]>(ipfs.get),
  add: promisify<[{ path: string; hash: string; size: number }]>(ipfs.add),
  pin: promisify<[{ hash: string }]>(ipfs.pin.add),
};

export interface BoostImgProps {
  charterUri?: string;
}

export interface BoostImgState {
  fetchInProgress: boolean;
  charter?: any;
}

export class BoostImg extends React.Component<BoostImgProps, BoostImgState> {
  constructor(props: BoostImgProps) {
    super(props);
    this.state = {
      fetchInProgress: false,
    };
  }
  public async componentDidMount(): Promise<void> {
    if (!this.props.charterUri) {
      return;
    }
    const uri = this.props.charterUri.replace("ipfs://", "/ipfs/");
    const content = await ipfsAsync.get(uri);
    const ipfsFile = content.reduce((acc, file) => acc + file.content.toString("utf8"), "");
    const charter = JSON.parse(ipfsFile.toString());
    this.setState({ charter });
  }

  public render(): JSX.Element {
    if (this.state.charter) {
      return (
        <>
          <img
            src={this.state.charter.logoUrl || ((defaultNewsroomImgUrl as any) as string)}
            onError={e => {
              (e.target as any).src = defaultNewsroomImgUrl;
            }}
          />
        </>
      );
    } else {
      return <></>;
    }
  }
}
