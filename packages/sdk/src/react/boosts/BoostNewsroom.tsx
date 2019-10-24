import * as React from "react";
import { Link } from "react-router-dom";
import {
  defaultNewsroomImgUrl,
  HelmetHelper,
  CivilContext,
  ICivilContext,
  RENDER_CONTEXT,
  ChevronAnchor,
} from "@joincivil/components";
import { CharterData } from "@joincivil/core";
import * as IPFS from "ipfs-http-client";
import { promisify } from "@joincivil/utils";
import { BoostNewsroomData } from "./types";
import {
  BoostImgDiv,
  BoostImgDivMobile,
  BoostNewsroomInfo,
  BoostNewsroomName,
  BoostFlexStartMobile,
} from "./BoostStyledComponents";

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

export interface BoostNewsroomProps {
  open: boolean;
  boostOwner?: boolean;
  boostId: string;
  charterUri?: string;
  newsroomContractAddress: string;
  newsroomData: BoostNewsroomData;
  disableHelmet?: boolean;
}

export interface BoostNewsroomState {
  fetchInProgress: boolean;
  charter?: CharterData;
}

export class BoostNewsroom extends React.Component<BoostNewsroomProps, BoostNewsroomState> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  constructor(props: BoostNewsroomProps) {
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
    return (
      <>
        {/*data URIs are invalid for fb/twitter cards, so only put image in there if http URL:*/}
        {!this.props.disableHelmet &&
          this.state.charter &&
          this.state.charter.logoUrl &&
          this.state.charter.logoUrl.indexOf("http") === 0 && <HelmetHelper image={this.state.charter.logoUrl} />}

        <BoostImgDiv>{this.renderImage()}</BoostImgDiv>
        <BoostFlexStartMobile>
          <BoostImgDivMobile>{this.renderImage()}</BoostImgDivMobile>
          <BoostNewsroomInfo>
            <BoostNewsroomName href={this.state.charter && this.state.charter.newsroomUrl} target="_blank">
              {this.props.newsroomData.name}
            </BoostNewsroomName>
            {this.props.open && (
              <>
                {this.props.boostOwner && (
                  <ChevronAnchor component={Link} to={`/boosts/${this.props.boostId}/edit`}>
                    <b>Edit Boost</b>
                  </ChevronAnchor>
                )}
                {this.renderNewsroomURL()}
                <ChevronAnchor
                  href={`${document.location.origin}/listing/${this.props.newsroomContractAddress}`}
                  target="_blank"
                >
                  View on Civil Registry
                </ChevronAnchor>
              </>
            )}
          </BoostNewsroomInfo>
        </BoostFlexStartMobile>
      </>
    );
  }

  private renderImage(): JSX.Element {
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

  private renderNewsroomURL(): JSX.Element {
    if (this.state.charter && this.context.renderContext !== RENDER_CONTEXT.EMBED) {
      return (
        <ChevronAnchor href={this.state.charter.newsroomUrl} target="_blank">
          Visit Newsroom
        </ChevronAnchor>
      );
    } else {
      return <></>;
    }
  }
}
