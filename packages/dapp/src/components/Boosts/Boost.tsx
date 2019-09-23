import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import { BoostWrapper, ComingSoonText } from "./BoostStyledComponents";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { Boost } from "@joincivil/sdk";
import { FeatureFlag } from "@joincivil/components";

export interface BoostPageProps {
  match: any;
  boostId: string;
  editMode?: boolean;
  payment?: boolean;
}

class BoostPage extends React.Component<BoostPageProps> {
  public render(): JSX.Element {
    return (
      <>
        <Helmet title={(this.props.editMode ? "Edit " : "") + "Civil Boost - The Civil Registry"} />
        <ScrollToTopOnMount />
        <FeatureFlag feature={"boosts-mvp"} replacement={<ComingSoonText />}>
          <BoostWrapper>
            <Boost
              open={true}
              boostId={this.props.boostId}
              editMode={this.props.editMode}
              payment={this.props.payment}
            />
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
