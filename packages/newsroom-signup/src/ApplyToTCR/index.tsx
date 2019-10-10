import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { BigNumber } from "@joincivil/typescript-types";
import { Civil, EthAddress, ListingWrapper, isInApplicationPhase, NewsroomInstance } from "@joincivil/core";
import { Parameters, getFormattedParameterValue } from "@joincivil/utils";
import { NextBack } from "../styledComponents";
import { getListing, getNewsroomMultisigBalance } from "../actionCreators";
import ApplyToTCR from "./ApplyToTCR";
import ApplyToTCRSuccess from "./ApplyToTCRSuccess";

export interface ApplyToTCRStepOwnProps {
  address?: EthAddress;
  newsroom: NewsroomInstance;
  civil?: Civil;
  minDeposit: BigNumber;
  applyStageLen: BigNumber;
  navigate(go: 1 | -1): void;
}

export interface ApplyToTCRStepReduxProps {
  userBalance: BigNumber;
  multisigBalance: BigNumber;
  applyStageLenDisplay?: string;
  minDeposit: BigNumber;
  multisigAddress?: EthAddress;
  multisigHasMinDeposit: boolean;
  listing?: ListingWrapper;
}

export type TApplyToTCRStepProps = ApplyToTCRStepOwnProps & ApplyToTCRStepReduxProps;

class ApplyToTCRStepComponent extends React.Component<TApplyToTCRStepProps & DispatchProp<any>> {
  public async componentDidMount(): Promise<void> {
    if (this.props.civil && this.props.address) {
      await this.hydrateListing();
      await this.hydrateNewsroomMultisigBalance();
    }
  }

  public async componentDidUpdate(prevProps: TApplyToTCRStepProps & DispatchProp<any>): Promise<void> {
    if (prevProps.address !== this.props.address || prevProps.newsroom !== this.props.newsroom) {
      await this.hydrateListing();
      await this.hydrateNewsroomMultisigBalance();
    }
  }

  public renderApply(): JSX.Element {
    const { listing, applyStageLenDisplay } = this.props;
    if (listing && listing.data && isInApplicationPhase(listing.data) && applyStageLenDisplay) {
      return <ApplyToTCRSuccess listing={listing} applyStageLenDisplay={applyStageLenDisplay} />;
    }

    return (
      <ApplyToTCR
        {...this.props}
        postTransfer={this.hydrateNewsroomMultisigBalance}
        postApplyToTCR={this.postApplyToTCR}
      />
    );
  }

  public render(): JSX.Element {
    return (
      <>
        {this.renderApply()}
        <NextBack navigate={this.props.navigate} nextHidden={true} />
      </>
    );
  }

  private hydrateNewsroomMultisigBalance = async (): Promise<void> => {
    if (this.props.address && this.props.newsroom && this.props.civil) {
      const multisigAddress = await this.props.newsroom.getMultisigAddress();
      if (multisigAddress) {
        await this.props.dispatch!(getNewsroomMultisigBalance(this.props.address, multisigAddress, this.props.civil));
      }
    }
  };

  private postApplyToTCR = async (): Promise<void> => {
    this.props.navigate(1);
    await this.hydrateListing();
  };

  private hydrateListing = async (): Promise<void> => {
    const { address } = this.props;
    if (!this.props.listing && address) {
      await this.props.dispatch!(getListing(address, this.props.civil!));
    }
  };
}

const mapStateToProps = (state: any, ownProps: ApplyToTCRStepOwnProps): TApplyToTCRStepProps => {
  const newsroom = state.newsrooms.get(ownProps.address);
  const { listings, user } = state.networkDependent;
  const listingWrapperWithExpiry: { listing: ListingWrapper; expiry: number } | undefined = listings.get(
    ownProps.address,
  );
  let listing;
  if (listingWrapperWithExpiry) {
    listing = listingWrapperWithExpiry.listing;
  }

  const multisigAddress = newsroom && newsroom.multisigAddress;
  const multisigBalance = (newsroom && newsroom.multisigBalance) || new BigNumber(0);

  const applyStageLenValue = ownProps.applyStageLen;
  let applyStageLenDisplay;
  if (applyStageLenValue) {
    applyStageLenDisplay = getFormattedParameterValue(Parameters.applyStageLen, applyStageLenValue);
  }

  const userBalance = new BigNumber((user && user.account && user.account.account !== "" && user.account.balance) || 0);

  const minDeposit = ownProps.minDeposit;

  const multisigHasMinDeposit = multisigBalance.gte(minDeposit);

  return {
    ...ownProps,
    newsroom: newsroom ? newsroom.newsroom : null,
    listing,
    userBalance,
    multisigAddress,
    multisigBalance,
    applyStageLenDisplay,
    minDeposit,
    multisigHasMinDeposit,
  };
};

export const ApplyToTCRStep = connect(mapStateToProps)(ApplyToTCRStepComponent);
