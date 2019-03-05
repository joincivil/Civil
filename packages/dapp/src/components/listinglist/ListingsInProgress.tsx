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

import { StyledListingCopy } from "../utility/styledComponents";

import ListingList from "./ListingList";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";

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
          <StyledListingCopy>
            New applications are subject to Civil community review to ensure alignment with the{" "}
            <a href="https://civil.co/constitution/">Civil Constitution</a>. If you believe any of these Newsrooms don't
            abide by the Civil Constitution, you may challenge them at any time.{" "}
            <a href="#zendesk" target="_blank">
              Learn how
            </a>.
          </StyledListingCopy>
          <ListingList
            ListingItemComponent={ListingSummaryUnderChallengeComponent}
            listings={this.props.applications}
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
          <StyledListingCopy>
            These Newsrooms have been challenged by a community member who perceives they violated the{" "}
            <a href="https://civil.co/constitution/">Civil Constitution</a>. You can vote to accept or reject the
            Newsroom from the Civil Registry and potentially earn Civil tokens when you vote.{" "}
            <a href="#zendesk">Learn how</a>.
          </StyledListingCopy>
          <ListingList ListingItemComponent={ListingSummaryUnderChallengeComponent} listings={beingChallenged} />
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
          <StyledListingCopy>
            The <a href="http://civilfound.org/">Civil Council</a> has agreed to consider the appeals of these
            challenged Newsrooms. Their decisions are based on the{" "}
            <a href="https://civil.co/constitution/">Civil Constitution</a>. If you disagree with the Civil Council’s
            decision, you will have a chance to challenge it. <a href="#zendesk">Learn how</a>.
          </StyledListingCopy>
          <ListingList ListingItemComponent={ListingSummaryUnderChallengeComponent} listings={consideringAppeal} />
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
          <StyledListingCopy>
            A community member has challenged the Civil Council's appeal decision on these Newsrooms' fate, based on the{" "}
            <a href="https://civil.co/constitution/">Civil Constitution</a>. You can vote to uphold or overturn the
            Civil Council's decision and potentially earn Civil tokens when you vote. <a href="#zendesk">Learn how</a>.
          </StyledListingCopy>
          <ListingList ListingItemComponent={ListingSummaryUnderChallengeComponent} listings={appealChallenge} />;
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
          <StyledListingCopy>
            The Civil community has spoken and the vote results are in. In order to enact the decision, community
            members must update the Newsroom's status. <a href="#zendesk">Learn more</a>.
          </StyledListingCopy>
          <ListingList ListingItemComponent={ListingSummaryReadyToUpdateComponent} listings={readyToUpdate} />
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
