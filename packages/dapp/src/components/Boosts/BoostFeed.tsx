import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import { BoostHeaderWrapper, BoostHeader, BoostWrapper, BoostIntro, BoostFeedWrapper } from "./BoostStyledComponents";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../utility/ScrollToTop";

export interface BoostFeedPageProps {
  network: string;
}

class BoostFeedPage extends React.Component<BoostFeedPageProps> {
  public render(): JSX.Element {
    return (
      <>
        <Helmet title="Civil Boost - The Civil Registry" />
        <ScrollToTopOnMount />
        <BoostHeaderWrapper>
          <BoostHeader>Civil Boost</BoostHeader>
        </BoostHeaderWrapper>
        <BoostWrapper>
          <BoostIntro>
            Boosts are mini-fundraisers. Newsrooms can use them to let their audience know about what they would like to
            do, and let their fans help them do it. The best boosts are smallish and short-term, with a concrete
            description of what the newsroom wants to accomplish, what the costs are, and exactly what the outcome will
            be. Good reporting costs money, and the Civil community wants to help make it happen.
          </BoostIntro>
          <BoostFeedWrapper>
            This is a Boost. This is a Boost. This is a Boost.
          </BoostFeedWrapper>
        </BoostWrapper>
      </>
    );
  }
}

const mapStateToProps = (state: State): BoostFeedPageProps => {
  const { network } = state;

  return { network };
};

export default connect(mapStateToProps)(BoostFeedPage);
