import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import { BoostWrapper } from "./BoostStyledComponents";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { Boost } from "@joincivil/civil-sdk";

export interface BoostPageProps {
  match: any;
  boostId: string;
  editMode?: boolean;
  history: any;
  payment?: boolean;
}

class BoostPage extends React.Component<BoostPageProps> {
  public render(): JSX.Element {
    return (
      <>
        <Helmet title={(this.props.editMode ? "Edit " : "") + "Civil Boost - The Civil Registry"} />
        <ScrollToTopOnMount />
        <BoostWrapper>
          <Boost
            open={true}
            boostId={this.props.boostId}
            editMode={this.props.editMode}
            history={this.props.history}
            payment={this.props.payment}
          />
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
