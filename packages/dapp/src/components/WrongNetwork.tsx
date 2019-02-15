import * as React from "react";
import { connect } from "react-redux";
import { State } from "../redux/reducers";
import { isNetworkSupported, supportedNetworks, getFormattedNetworkNames } from "../helpers/networkHelpers";
import { WrongNetworkModal } from "@joincivil/components";

export interface WrongNetworkProps {
  network: string;
}

const WrongNetwork: React.SFC<WrongNetworkProps> = props => {
  if (!isNetworkSupported(props.network)) {
    const supportedNetworkNames = getFormattedNetworkNames(supportedNetworks);
    let formattedSupportedNetworkNames;
    if (supportedNetworkNames.length > 2) {
      supportedNetworkNames[supportedNetworkNames.length - 1] = `or ${
        supportedNetworkNames[supportedNetworkNames.length - 1]
      }`;
      formattedSupportedNetworkNames = supportedNetworkNames.join(", ");
    } else {
      formattedSupportedNetworkNames = supportedNetworkNames.join(" or ");
    }
    return (
      <WrongNetworkModal requiredNetworkNiceName={formattedSupportedNetworkNames} helpUrlBase="https://civil.co/" />
    );
  }

  return <></>;
};

const mapStateToProps = (state: State): WrongNetworkProps => {
  const { network } = state;

  return { network };
};

export default connect(mapStateToProps)(WrongNetwork);
