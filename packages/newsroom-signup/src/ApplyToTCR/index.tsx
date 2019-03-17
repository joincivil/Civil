import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { BigNumber } from "bignumber.js";
import { Civil, EthAddress, ListingWrapper, isInApplicationPhase } from "@joincivil/core";
import { Parameters, getFormattedParameterValue } from "@joincivil/utils";
import { getListing, getNewsroomMultisigBalance } from "../actionCreators";
import ApplyToTCR from "./ApplyToTCR";
import ApplyToTCRSuccess from "./ApplyToTCRSuccess";

export interface ApplyToTCRStepOwnProps {
  address?: EthAddress;
  newsroom: any;
  civil?: Civil;
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

  public render(): JSX.Element {
    const { listing, applyStageLenDisplay } = this.props;
    if (listing && listing.data && isInApplicationPhase(listing.data) && applyStageLenDisplay) {
      return <ApplyToTCRSuccess listing={listing} applyStageLenDisplay={applyStageLenDisplay} />;
    }

    return (
      <>
        <ApplyToTCR
          {...this.props}
          postTransfer={this.hydrateNewsroomMultisigBalance}
          postApplyToTCR={this.hydrateListing}
        />
      </>
    );
  }

  private hydrateNewsroomMultisigBalance = async (): Promise<void> => {
    if (this.props.address && this.props.newsroom && this.props.civil) {
      const multisigAddress = await this.props.newsroom.getMultisigAddress();
      await this.props.dispatch!(getNewsroomMultisigBalance(this.props.address, multisigAddress, this.props.civil));
    }
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
  const { listings, parameters, user } = state.networkDependent;
  const listingWrapperWithExpiry: { listing: ListingWrapper; expiry: number } | undefined = listings.get(
    ownProps.address,
  );
  let listing;
  if (listingWrapperWithExpiry) {
    listing = listingWrapperWithExpiry.listing;
  }

  const multisigAddress = newsroom && newsroom.multisigAddress;
  const multisigBalance = (newsroom && newsroom.multisigBalance) || new BigNumber(0);

  const applyStageLenValue = parameters && parameters[Parameters.applyStageLen];
  let applyStageLenDisplay;
  if (applyStageLenValue) {
    applyStageLenDisplay = getFormattedParameterValue(Parameters.applyStageLen, applyStageLenValue);
  }

  const userBalance = new BigNumber((user && user.account && user.account.account !== "" && user.account.balance) || 0);

  const minDeposit = new BigNumber((parameters && parameters[Parameters.minDeposit]) || 0);

  const multisigHasMinDeposit = multisigBalance.greaterThanOrEqualTo(minDeposit);

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
