import * as React from "react";
import { Set } from "immutable";
import { Tabs } from "../utility/Tabs";
import { PillTab } from "@joincivil/components";

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
      <Tabs>
        <PillTab tabText={"My Newsrooms"} tabCount={" (" + currentUserNewsrooms.count() + ")"}>
          <ListingList listings={currentUserNewsrooms} />
        </PillTab>
        <PillTab tabText={"Challenges I've Voted On"} tabCount={" (" + currentUserChallengesVotedOn.count() + ")"}>
          <ListingList challenges={currentUserChallengesVotedOn} />
        </PillTab>
        <PillTab tabText={"Challenges I've Started"} tabCount={" (" + currentUserChallengesStarted.count() + ")"}>
          <ListingList challenges={currentUserChallengesStarted} />
        </PillTab>
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
