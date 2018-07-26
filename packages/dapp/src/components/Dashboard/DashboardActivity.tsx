import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { DashboardActivity as DashboardActivityComponent } from "@joincivil/components";

import { Tabs } from "../tabs/Tabs";
import { Tab } from "../tabs/Tab";
import { State } from "../../reducers";
import ActivityList from "./ActivityList";

export interface DashboardActivityProps {
  currentUserNewsrooms: Set<string>;
  currentUserChallengesVotedOn: Set<string>;
  currentUserChallengesStarted: Set<string>;
}

class DashboardActivity extends React.Component<DashboardActivityProps> {
  public render(): JSX.Element {
    const currentUserNewsrooms = this.props.currentUserNewsrooms;
    const currentUserChallengesVotedOn = this.props.currentUserChallengesVotedOn;
    const currentUserChallengesStarted = this.props.currentUserChallengesStarted;
    return (
      <DashboardActivityComponent>
        <Tabs>
          <Tab tabText={"Newsrooms owned (" + currentUserNewsrooms.count() + ")"}>
            <ActivityList listings={currentUserNewsrooms} />
          </Tab>
          <Tab tabText={"Challenges voted on (" + currentUserChallengesVotedOn.count() + ")"}>
            <ActivityList challenges={currentUserChallengesVotedOn} />
          </Tab>
          <Tab tabText={"Challenges started (" + currentUserChallengesStarted.count() + ")"}>
            <ActivityList challenges={currentUserChallengesStarted} />
          </Tab>
        </Tabs>
      </DashboardActivityComponent>
    );
  }
}

const mapStateToProps = (state: State): DashboardActivityProps => {
  const { currentUserNewsrooms, challengesVotedOnByUser, challengesStartedByUser, user } = state.networkDependent;
  let currentUserChallengesVotedOn = Set<string>();
  if (user.account && challengesVotedOnByUser.has(user.account.account)) {
    currentUserChallengesVotedOn = challengesVotedOnByUser.get(user.account.account);
  }
  let currentUserChallengesStarted = Set<string>();
  if (user.account && challengesStartedByUser.has(user.account.account)) {
    currentUserChallengesStarted = challengesStartedByUser.get(user.account.account);
  }

  return {
    currentUserNewsrooms,
    currentUserChallengesVotedOn,
    currentUserChallengesStarted,
  };
};

export default connect(mapStateToProps)(DashboardActivity);
