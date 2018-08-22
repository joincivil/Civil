import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import styled from "styled-components";
import { Tabs, Tab, StyledTab, DashboardActivity as DashboardActivityComponent } from "@joincivil/components";
import { State } from "../../reducers";
import {
  makeGetUserChallengesWithUnclaimedRewards,
  makeGetUserChallengesWithUnrevealedVotes,
  makeGetUserChallengesWithRescueTokens,
} from "../../selectors";
import ActivityList from "./ActivityList";

export interface DashboardActivityProps {
  currentUserNewsrooms: Set<string>;
  currentUserChallengesVotedOn: Set<string>;
  currentUserChallengesStarted: Set<string>;
  userChallengesWithUnclaimedRewards?: Set<string>;
  userChallengesWithUnrevealedVotes?: Set<string>;
  userChallengesWithRescueTokens?: Set<string>;
}

const StyledTabsComponent = styled.div`
  display: flex;
  justify-content: center;
`;

class DashboardActivity extends React.Component<DashboardActivityProps> {
  public render(): JSX.Element {
    return (
      <DashboardActivityComponent
        userVotes={this.renderUserVotes()}
        userNewsrooms={this.renderUserNewsrooms()}
        userChallenges={this.renderUserChallenges()}
      />
    );
  }

  private renderUserNewsrooms = (): JSX.Element => {
    return <ActivityList listings={this.props.currentUserNewsrooms} />;
  };

  private renderUserChallenges = (): JSX.Element => {
    return <ActivityList challenges={this.props.currentUserChallengesStarted} />;
  };

  private renderUserVotes = (): JSX.Element => {
    const {
      currentUserChallengesVotedOn,
      userChallengesWithUnclaimedRewards,
      userChallengesWithUnrevealedVotes,
      userChallengesWithRescueTokens,
    } = this.props;
    return (
      <Tabs TabComponent={StyledTab} TabsNavComponent={StyledTabsComponent}>
        <Tab title={"Challenges voted on (" + currentUserChallengesVotedOn.count() + ")"}>
          <ActivityList challenges={currentUserChallengesVotedOn} />
        </Tab>
        <Tab title={"Reveal Vote (" + userChallengesWithUnrevealedVotes!.count() + ")"}>
          <ActivityList challenges={userChallengesWithUnrevealedVotes} />
        </Tab>
        <Tab title={"Claim Rewards (" + userChallengesWithUnclaimedRewards!.count() + ")"}>
          <ActivityList challenges={userChallengesWithUnclaimedRewards} />
        </Tab>
        <Tab title={"Rescue Tokens (" + userChallengesWithRescueTokens!.count() + ")"}>
          <ActivityList challenges={userChallengesWithRescueTokens} />
        </Tab>
      </Tabs>
    );
  };
}

const makeMapStateToProps = () => {
  const getUserChallengesWithUnclaimedRewards = makeGetUserChallengesWithUnclaimedRewards();
  const getUserChallengesWithUnrevealedVotes = makeGetUserChallengesWithUnrevealedVotes();
  const getUserChallengesWithRescueTokens = makeGetUserChallengesWithRescueTokens();

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

    const userChallengesWithUnclaimedRewards = getUserChallengesWithUnclaimedRewards(state);
    const userChallengesWithUnrevealedVotes = getUserChallengesWithUnrevealedVotes(state);
    const userChallengesWithRescueTokens = getUserChallengesWithRescueTokens(state);

    return {
      currentUserNewsrooms,
      currentUserChallengesVotedOn,
      currentUserChallengesStarted,
      userChallengesWithUnclaimedRewards,
      userChallengesWithUnrevealedVotes,
      userChallengesWithRescueTokens,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(DashboardActivity);
