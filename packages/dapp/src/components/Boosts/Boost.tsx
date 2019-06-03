import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import { BoostHeaderWrapper, BoostHeader, BoostWrapper } from "./BoostStyledComponents";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { Boost } from "@joincivil/civil-sdk";

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
        <BoostHeaderWrapper>
          <BoostHeader>Civil Boost</BoostHeader>
        </BoostHeaderWrapper>
        <BoostWrapper>
          <Boost open={true} boostId={this.props.boostId} />
        </BoostWrapper>
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
