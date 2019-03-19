import * as React from "react";
import { Helmet } from "react-helmet";
import { Set } from "immutable";

import { NewsroomListing } from "@joincivil/core";
import {
  Tabs,
  Tab,
  StyledSquarePillTabNav,
  StyledSquarePillTab,
  NewApplicationsTabTitle,
  UnderChallengeTabTitle,
  AppealToCouncilTabTitle,
  ChallengeCouncilAppealTabTitle,
  ReadyToUpdateTabTitle,
  ListingSummaryUnderChallengeComponent,
  ListingSummaryReadyToUpdateComponent,
} from "@joincivil/components";

import ListingList from "./ListingList";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";
import {
  NewApplicationsTabDescription,
  UnderChallengeTabDescription,
  UnderAppealTabDescription,
  UnderAppealChallengeTabDescription,
  ReadyToUpdateTabDescription,
} from "./TabDescriptions";

export interface ListingProps {
  match?: any;
  history?: any;
}

export interface ListingsInProgressProps {
  applications: Set<NewsroomListing>;
  readyToWhitelistListings: Set<NewsroomListing>;
  inChallengeCommitListings: Set<NewsroomListing>;
  inChallengeRevealListings: Set<NewsroomListing>;
  awaitingAppealRequestListings: Set<NewsroomListing>;
  awaitingAppealJudgmentListings: Set<NewsroomListing>;
  awaitingAppealChallengeListings: Set<NewsroomListing>;
  appealChallengeCommitPhaseListings: Set<NewsroomListing>;
  appealChallengeRevealPhaseListings: Set<NewsroomListing>;
  resolveChallengeListings: Set<NewsroomListing>;
  resolveAppealListings: Set<NewsroomListing>;
  govtParameters: any;
}

const TABS: string[] = [
  "new-applications",
  "under-challenge",
  "under-appeal",
  "decision-challenged",
  "ready-to-update",
];

class ListingsInProgress extends React.Component<ListingProps & ListingsInProgressProps> {
  public render(): JSX.Element {
    const { subListingType } = this.props.match.params;
    let activeIndex = 0;
    if (subListingType) {
      activeIndex = TABS.indexOf(subListingType) || 0;
    }
    const applications = this.props.applications;
    const beingChallenged = this.props.inChallengeCommitListings
      .merge(this.props.inChallengeRevealListings)
      .merge(this.props.awaitingAppealRequestListings);
    const consideringAppeal = this.props.awaitingAppealJudgmentListings.merge(
      this.props.awaitingAppealChallengeListings,
    );
    const appealChallenge = this.props.appealChallengeCommitPhaseListings.merge(
      this.props.appealChallengeRevealPhaseListings,
    );
    const readyToUpdate = this.props.readyToWhitelistListings
      .merge(this.props.resolveChallengeListings)
      .merge(this.props.resolveAppealListings);

    const newApplicationsTab = <NewApplicationsTabTitle count={applications.count()} />;
    const underChallengeTab = <UnderChallengeTabTitle count={beingChallenged.count()} />;
    const appealToCouncilTab = <AppealToCouncilTabTitle count={consideringAppeal.count()} />;
    const challengeCouncilAppealTab = <ChallengeCouncilAppealTabTitle count={appealChallenge.count()} />;
    const readyToUpdateTab = <ReadyToUpdateTabTitle count={readyToUpdate.count()} />;

    return (
      <Tabs
        activeIndex={activeIndex}
        TabsNavComponent={StyledSquarePillTabNav}
        TabComponent={StyledSquarePillTab}
        onActiveTabChange={this.onTabChange}
      >
        <Tab title={newApplicationsTab}>
          <>
            <Helmet title="New Applications - The Civil Registry" />
            {this.renderApplications()}
          </>
        </Tab>
        <Tab title={underChallengeTab}>
          <>
            <Helmet title="Newsrooms Under Challenge - The Civil Registry" />
            {this.renderUnderChallenge()}
          </>
        </Tab>
        <Tab title={appealToCouncilTab}>
          <>
            <Helmet title="Newsrooms Under Appeal - The Civil Registry" />
            {this.renderUnderAppeal()}
          </>
        </Tab>
        <Tab title={challengeCouncilAppealTab}>
          <>
            <Helmet title="Newsrooms Decision Challenged- The Civil Registry" />
            {this.renderUnderAppealChallenge()}
          </>
        </Tab>
        <Tab title={readyToUpdateTab}>
          <>
            <Helmet title="Newsrooms Ready To Update - The Civil Registry" />
            {this.renderReadyToUpdate()}
          </>
        </Tab>
      </Tabs>
    );
  }

  private renderApplications = (): JSX.Element => {
    if (this.props.applications.count()) {
      return (
        <>
          <NewApplicationsTabDescription />
          <ListingList
            ListingItemComponent={ListingSummaryUnderChallengeComponent}
            listings={this.props.applications}
            history={this.props.history}
          />
        </>
      );
    }

    return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.IN_APPLICATION} />;
  };

  private renderUnderChallenge = (): JSX.Element => {
    const beingChallenged = this.props.inChallengeCommitListings
      .merge(this.props.inChallengeRevealListings)
      .merge(this.props.awaitingAppealRequestListings);

    if (beingChallenged.count()) {
      return (
        <>
          <UnderChallengeTabDescription />
          <ListingList
            ListingItemComponent={ListingSummaryUnderChallengeComponent}
            listings={beingChallenged}
            history={this.props.history}
          />
        </>
      );
    }

    return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.UNDER_CHALLENGE} />;
  };

  private renderUnderAppeal = (): JSX.Element => {
    const consideringAppeal = this.props.awaitingAppealJudgmentListings.merge(
      this.props.awaitingAppealChallengeListings,
    );

    if (consideringAppeal.count()) {
      return (
        <>
          <UnderAppealTabDescription />
          <ListingList
            ListingItemComponent={ListingSummaryUnderChallengeComponent}
            listings={consideringAppeal}
            history={this.props.history}
          />
        </>
      );
    }

    return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.UNDER_APPEAL} />;
  };

  private renderUnderAppealChallenge = (): JSX.Element => {
    const appealChallenge = this.props.appealChallengeCommitPhaseListings.merge(
      this.props.appealChallengeRevealPhaseListings,
    );

    if (appealChallenge.count()) {
      return (
        <>
          <UnderAppealChallengeTabDescription />
          <ListingList
            ListingItemComponent={ListingSummaryUnderChallengeComponent}
            listings={appealChallenge}
            history={this.props.history}
          />;
        </>
      );
    }

    return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.UNDER_APPEAL_CHALLENGE} />;
  };

  private renderReadyToUpdate = (): JSX.Element => {
    const readyToUpdate = this.props.readyToWhitelistListings
      .merge(this.props.resolveChallengeListings)
      .merge(this.props.resolveAppealListings);

    if (readyToUpdate.count()) {
      return (
        <>
          <ReadyToUpdateTabDescription />
          <ListingList
            ListingItemComponent={ListingSummaryReadyToUpdateComponent}
            listings={readyToUpdate}
            history={this.props.history}
          />
        </>
      );
    }

    return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.READY_TO_UPDATE} />;
  };

  private onTabChange = (activeIndex: number = 0): void => {
    const tabName = this.props.match.params.listingType;
    const subTabName = TABS[activeIndex];
    this.props.history.push(`/registry/${tabName}/${subTabName}`);
  };
}

export default ListingsInProgress;
