import * as React from "react";
import { Set } from "immutable";
import { Tabs, Tab } from "@joincivil/components";
import { MyActivityTabNav, MyActivityTab } from "./styledComponents";

import ListingList from "./ListingList";
import { connect } from "react-redux";
import { State } from "../../reducers";

export interface MyActivityProps {
  currentUserNewsrooms: Set<string>;
  currentUserChallengesVotedOn: Set<string>;
  currentUserChallengesStarted: Set<string>;
}

class MyActivity extends React.Component<MyActivityProps> {
  public render(): JSX.Element {
    const currentUserNewsrooms = this.props.currentUserNewsrooms;
    const currentUserChallengesVotedOn = this.props.currentUserChallengesVotedOn;
    const currentUserChallengesStarted = this.props.currentUserChallengesStarted;
    return (
      <Tabs TabsNavComponent={MyActivityTabNav} TabComponent={MyActivityTab}>
        <Tab title={"My Newsrooms (" + currentUserNewsrooms.count() + ")"}>
          <ListingList listings={currentUserNewsrooms} />
        </Tab>
        <Tab title={"Challenges I've Voted On (" + currentUserChallengesVotedOn.count() + ")"}>
          <ListingList challenges={currentUserChallengesVotedOn} />
        </Tab>
        <Tab title={"Challenges I've Started (" + currentUserChallengesStarted.count() + ")"}>
          <ListingList challenges={currentUserChallengesStarted} />
        </Tab>
      </Tabs>
    );
  }
}

const mapStateToProps = (state: State): MyActivityProps => {
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

export default connect(mapStateToProps)(MyActivity);
