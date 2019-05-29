import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import { BoostHeaderWrapper, BoostHeader, BoostWrapper } from "./BoostStyledComponents";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../utility/ScrollToTop";

export interface BoostPageProps {
  network: string;
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
        <BoostWrapper>This is a Boost.</BoostWrapper>
      </>
    );
  }
}

const mapStateToProps = (state: State): BoostPageProps => {
  const { network } = state;

  return { network };
};

export default connect(mapStateToProps)(BoostPage);
