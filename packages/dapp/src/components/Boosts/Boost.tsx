import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import { BoostHeaderWrapper, BoostHeader, BoostWrapper, ComingSoonText } from "./BoostStyledComponents";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { Boost } from "@joincivil/civil-sdk";
import { FeatureFlag } from "@joincivil/components";

export interface BoostPageProps {
  match: any;
  boostId: string;
}

class BoostPage extends React.Component<BoostPageProps> {
  public render(): JSX.Element {
    return (
      <>
        <Helmet title="Civil Boost - The Civil Registry" />
        <ScrollToTopOnMount />
        <FeatureFlag feature={"boost"} replacement={<ComingSoonText />}>
          <BoostHeaderWrapper>
            <BoostHeader>
              <h1>Civil Boost</h1>
              <a href="/boosts">&lsaquo; Back to Boost</a>
            </BoostHeader>
          </BoostHeaderWrapper>
          <BoostWrapper>
            <Boost open={true} boostId={this.props.boostId} />
          </BoostWrapper>
        </FeatureFlag>
      </>
    );
  }
}

const mapStateToProps = (state: State, ownProps: BoostPageProps): BoostPageProps => {
  return {
    ...ownProps,
    boostId: ownProps.match.params.boostId,
  };
};

export default connect(mapStateToProps)(BoostPage);
