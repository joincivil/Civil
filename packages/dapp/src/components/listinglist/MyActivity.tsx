import * as React from "react";
import { Set } from "immutable";
import { Tabs, Tab, TabComponentProps, colors, fonts } from "@joincivil/components";
import styled from "styled-components";

import ListingList from "./ListingList";
import { connect } from "react-redux";
import { State } from "../../reducers";

export interface MyActivityProps {
  currentUserNewsrooms: Set<string>;
  currentUserChallengesVotedOn: Set<string>;
  currentUserChallengesStarted: Set<string>;
}

const StyledTabNav = styled.div`
  margin: 0 auto 50px;
  max-width: 1200px;
  width: 100%;
`;

const StyledTab = styled.li`
  background-color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_GRAY_4 : "transparent")};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 23px;
  color: ${colors.primary.BLACK};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  letter-spacing: -0.12px;
  list-style: none;
  margin-right: 10px;
  padding: 8px 15px;
  &:hover {
    background-color: ${colors.accent.CIVIL_GRAY_4};
  }
`;

class MyActivity extends React.Component<MyActivityProps> {
  public render(): JSX.Element {
    const currentUserNewsrooms = this.props.currentUserNewsrooms;
    const currentUserChallengesVotedOn = this.props.currentUserChallengesVotedOn;
    const currentUserChallengesStarted = this.props.currentUserChallengesStarted;
    return (
      <Tabs TabsNavComponent={StyledTabNav} TabComponent={StyledTab}>
        <Tab title={"My Newsrooms"} tabCount={" (" + currentUserNewsrooms.count() + ")"}>
          <ListingList listings={currentUserNewsrooms} />
        </Tab>
        <Tab title={"Challenges I've Voted On"} tabCount={" (" + currentUserChallengesVotedOn.count() + ")"}>
          <ListingList challenges={currentUserChallengesVotedOn} />
        </Tab>
        <Tab title={"Challenges I've Started"} tabCount={" (" + currentUserChallengesStarted.count() + ")"}>
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
