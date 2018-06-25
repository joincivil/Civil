import * as React from "react";
import { Set } from "immutable";
import { Tabs } from "../tabs/Tabs";
import { Tab } from "../tabs/Tab";

import ListingList from "./ListingList";
import { connect } from "react-redux";
import { State } from "../../reducers";

export interface MyActivityProps {
  currentUserNewsrooms: Set<string>;
  currentUserChallengesVotedOn: Set<string>;
}

class MyActivity extends React.Component<MyActivityProps> {
  public render(): JSX.Element {
    const currentUserNewsrooms = this.props.currentUserNewsrooms;
    const currentUserChallengesVotedOn = this.props.currentUserChallengesVotedOn;
    return (
      <Tabs>
        <Tab tabText={"My Newsrooms (" + currentUserNewsrooms.count() + ")"}>
          <ListingList listings={currentUserNewsrooms} />
        </Tab>
        <Tab tabText={"Challenges I've Voted On (" + currentUserChallengesVotedOn.count() + ")"}>
          <ListingList challenges={currentUserChallengesVotedOn} />
        </Tab>
      </Tabs>
    );
  }
}

const mapStateToProps = (state: State): MyActivityProps => {
  const { currentUserNewsrooms, challengesVotedOnByUser, user } = state.networkDependent;
  let currentUserChallengesVotedOn = Set<string>();
  if (user.account && challengesVotedOnByUser.has(user.account.account)) {
    currentUserChallengesVotedOn = challengesVotedOnByUser.get(user.account.account);
  }

  return {
    currentUserNewsrooms,
    currentUserChallengesVotedOn,
  };
};

export default connect(mapStateToProps)(MyActivity);
