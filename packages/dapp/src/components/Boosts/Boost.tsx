import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import { BoostWrapper, ComingSoonText } from "./BoostStyledComponents";
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
        <FeatureFlag feature={"boosts-mvp"} replacement={<ComingSoonText />}>
          <BoostWrapper>
            {/* TODO(sruddy) check if user is boost owner */}
            <Boost open={true} boostId={this.props.boostId} boostOwner={false} />
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
