import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";
import { Map } from "immutable";
import { diffSentences } from "diff";
import {
  fonts,
  colors,
  Button,
  InvertedButton,
  buttonSizes,
  NorthEastArrow,
  Dropdown,
  DropdownGroup,
  DropdownItem,
} from "@joincivil/components";
import {
  ListingWrapper,
  NewsroomWrapper,
  CharterData,
  EthContentHeader,
  StorageHeader,
  ContentData,
} from "@joincivil/core";
import { renderPTagsFromLineBreaks, getLocalDateTimeStrings } from "@joincivil/utils";
import LoadingMsg from "../utility/LoadingMsg";
import { State } from "../../redux/reducers";
import { getContent } from "../../redux/actionCreators/newsrooms";
import ListingCharterRosterMember from "./ListingCharterRosterMember";

export interface ListingCharterProps {
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  charterRevisionId?: number;
  charterRevisions?: Map<number, Partial<EthContentHeader>>;
  isListingUnderChallenge?: boolean;
}

interface ListingCharterReduxProps {
  content?: Map<string, ContentData>;
}

interface ListingCharterState {
  selectedCharterRevisionId?: number;
  isDiffModeEnabled: boolean;
}

const Wrapper = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
`;
const CharterHeading = styled.h2`
  font: 800 32px/34px ${fonts.SERIF};
  margin: 0 0 12px;
  color: ${colors.primary.BLACK};
`;
const CharterSubHeading = styled.h3`
  font: 600 21px/34px ${fonts.SERIF};
  margin: 24px 0 18px;
  color: ${colors.primary.BLACK};
`;
const Mission = styled.div`
  margin-bottom: 40px;
`;

const StyledCharterRevisionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 20px;

  & ${InvertedButton} {
    border-width: 1px;
    font-size: 12px;
    font-weight: bold;
    padding: 0 12px;
    text-transform: none;
    white-space: nowrap;
  }

  & ${DropdownItem} {
    cursor: pointer;
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const CharterDiffSummary = styled.p`
  && {
    font-size: 14px;
    margin: 12px 0 0;
  }
`;

const CharterTimestamp = styled.p`
  && {
    font-size: 14px;
    font-style: italic;
    line-height: 16px;
  }
`;

const CharterLockedText = styled.span`
  color: ${colors.accent.CIVIL_RED};
  display: block;
`;

const CharterTextAdded = styled.span`
  background-color: ${colors.accent.CIVIL_GREEN_2};
`;

const CharterTextRemoved = styled.span`
  color: ${colors.accent.CIVIL_RED};
  text-decoration: line-through;
`;

const VisitNewsroomWrapper = styled.div`
  padding-top: 32px;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  line-height: 32px;
  text-align: right;
`;

class ListingCharter extends React.Component<
  ListingCharterProps & ListingCharterReduxProps & DispatchProp<any>,
  ListingCharterState
> {
  constructor(props: ListingCharterProps) {
    super(props);
    this.state = {
      selectedCharterRevisionId: props.charterRevisionId || 0,
      isDiffModeEnabled: false,
    };
  }

  public async componentDidUpdate(prevProps: ListingCharterProps, prevState: ListingCharterState): Promise<void> {
    const { charterRevisions, dispatch } = this.props;
    const { selectedCharterRevisionId, isDiffModeEnabled } = this.state;

    if (prevState.selectedCharterRevisionId !== selectedCharterRevisionId && charterRevisions) {
      const charterRevision = charterRevisions.get(selectedCharterRevisionId!);
      if (charterRevision && charterRevision.uri) {
        dispatch!(await getContent(charterRevision as StorageHeader));
      }
    }

    if (isDiffModeEnabled && selectedCharterRevisionId && charterRevisions) {
      const prevCharterRevisionId = selectedCharterRevisionId - 1;
      const prevCharterRevision = charterRevisions.get(prevCharterRevisionId);
      if (prevCharterRevision && prevCharterRevision.uri) {
        dispatch!(await getContent(prevCharterRevision as StorageHeader));
      }
    }
  }

  public render(): JSX.Element {
    const { listing } = this.props;
    const charter = this.getSelectedCharterContent();
    const prevCharter = this.getSelectedPreviousCharterContent();

    if (!charter || !listing || !listing.data) {
      return <LoadingMsg />;
    }

    if (typeof charter !== "object" || !charter.mission || !charter.roster) {
      return <p style={{ color: "red" }}>Error: Newsroom charter is in an invalid format</p>;
    }

    return (
      <Wrapper>
        {this.renderCharterRevisionHeader()}

        <Mission>
          <CharterHeading>Our Mission</CharterHeading>
          {this.renderCharterField(charter.mission.purpose, prevCharter && prevCharter.mission.purpose)}

          <CharterSubHeading>Ownership Structure</CharterSubHeading>
          {this.renderCharterField(charter.mission.structure, prevCharter && prevCharter.mission.structure)}

          <CharterSubHeading>Current or Intended Revenue Sources</CharterSubHeading>
          {this.renderCharterField(charter.mission.revenue, prevCharter && prevCharter.mission.revenue)}

          <CharterSubHeading>Potential Conflicts of Interest</CharterSubHeading>
          {this.renderCharterField(charter.mission.encumbrances, prevCharter && prevCharter.mission.encumbrances)}

          <CharterSubHeading>Additional Information</CharterSubHeading>
          {this.renderCharterField(charter.mission.miscellaneous, prevCharter && prevCharter.mission.miscellaneous)}
        </Mission>

        <CharterHeading>Team</CharterHeading>
        {charter.roster.map((rosterMember, i) => <ListingCharterRosterMember key={i} member={rosterMember} />)}

        <VisitNewsroomWrapper>
          <Button size={buttonSizes.MEDIUM_WIDE} href={charter.newsroomUrl} target="_blank">
            Visit Newsroom <NorthEastArrow color={colors.basic.WHITE} />
          </Button>
        </VisitNewsroomWrapper>
      </Wrapper>
    );
  }

  private getSelectedCharterContent(): CharterData | undefined {
    const { content, charterRevisions } = this.props;
    const { selectedCharterRevisionId } = this.state;
    let charterRevision;
    let charter;
    if (content && charterRevisions) {
      charterRevision = charterRevisions.get(selectedCharterRevisionId!);
      if (charterRevision && charterRevision.uri) {
        charter = content.get(charterRevision.uri) as CharterData;
      }
    }
    return charter;
  }

  private getSelectedPreviousCharterContent(): CharterData | undefined {
    const { content, charterRevisions } = this.props;
    const { selectedCharterRevisionId } = this.state;
    let prevCharter;
    if (content && charterRevisions && selectedCharterRevisionId) {
      const prevCharterRevisionId = selectedCharterRevisionId - 1;
      const prevCharterRevision = charterRevisions.get(prevCharterRevisionId!);

      if (prevCharterRevision && prevCharterRevision.uri) {
        prevCharter = content.get(prevCharterRevision.uri) as CharterData;
      }
    }
    return prevCharter;
  }

  private getSelectedCharterTimestamp(): [string, string] | undefined {
    const { charterRevisions } = this.props;
    const { selectedCharterRevisionId } = this.state;

    let charterTimestamp;
    if (charterRevisions) {
      const charterRevision = charterRevisions.get(selectedCharterRevisionId!);
      charterTimestamp =
        charterRevision && charterRevision.timestamp && getLocalDateTimeStrings(charterRevision.timestamp);
    }
    return charterTimestamp;
  }

  private isViewingFirstRevision(): boolean {
    const { charterRevisions } = this.props;
    const { selectedCharterRevisionId } = this.state;
    let viewingFirstRevision = false;

    if (charterRevisions) {
      const revisionIdsSeq = charterRevisions!.keySeq().toIndexedSeq();
      if (selectedCharterRevisionId !== undefined) {
        viewingFirstRevision = revisionIdsSeq.indexOf(selectedCharterRevisionId) === 0;
      }
    }

    return viewingFirstRevision;
  }

  private renderCharterRevisionHeader(): JSX.Element {
    const { isDiffModeEnabled } = this.state;
    if (isDiffModeEnabled) {
      const charter = this.getSelectedCharterContent();
      const prevCharter = this.getSelectedPreviousCharterContent();

      if (!charter) {
        return <></>;
      }

      return (
        <StyledCharterRevisionsHeader>
          <div>
            <InvertedButton onClick={this.disableDiffMode} size={buttonSizes.SMALL}>
              Done Viewing
            </InvertedButton>
            {this.renderDiffSummary(charter.mission, prevCharter && prevCharter.mission)}
            {this.renderPendingUpdateMessage()}
          </div>
          <div>{this.renderCharterRevisionNav()}</div>
        </StyledCharterRevisionsHeader>
      );
    }

    return (
      <StyledCharterRevisionsHeader>
        <div>{this.renderSelectedCharterRevisionTimestamp()}</div>
        <div>{this.renderCharterRevisionNav()}</div>
      </StyledCharterRevisionsHeader>
    );
  }

  private renderCharterField(charterField: string, prevCharterField?: string): JSX.Element {
    const { isDiffModeEnabled } = this.state;
    let out = <></>;

    if (isDiffModeEnabled && (prevCharterField || this.isViewingFirstRevision())) {
      const diff = diffSentences(prevCharterField || "", charterField);
      out = (
        <>
          {diff.map(sentence => {
            if (sentence.added) {
              return renderPTagsFromLineBreaks(sentence.value, CharterTextAdded);
            } else if (sentence.removed) {
              return renderPTagsFromLineBreaks(sentence.value, CharterTextRemoved);
            }
            return renderPTagsFromLineBreaks(sentence.value);
          })}
        </>
      );
    } else {
      out = renderPTagsFromLineBreaks(charterField);
    }

    return <>{out}</>;
  }

  private renderPendingUpdateMessage(): JSX.Element | null {
    const { isListingUnderChallenge, charterRevisionId: frozenCharterRevisionId } = this.props;
    const { selectedCharterRevisionId } = this.state;

    let message = null;
    if (isListingUnderChallenge && selectedCharterRevisionId! > frozenCharterRevisionId!) {
      message = (
        <p>
          <CharterLockedText>
            This charter update is pending the completion of this newsroom's in-progress challenge
          </CharterLockedText>
        </p>
      );
    }
    return message;
  }

  private renderDiffSummary(charterMission: any, prevCharterMission: any): JSX.Element {
    if (charterMission && prevCharterMission) {
      const diffsSummary = Object.keys(charterMission).map(key => {
        if (prevCharterMission && !prevCharterMission[key]) {
          return [0, 0];
        }
        const fieldDiff = diffSentences(
          !this.isViewingFirstRevision() ? prevCharterMission[key] : "",
          charterMission[key],
        );
        const added = fieldDiff.filter(part => part.added).length;
        const removed = fieldDiff.filter(part => part.removed).length;
        return [added, removed];
      });
      const totalAdded = diffsSummary.map(diffSum => diffSum[0]).reduce((acc, value) => acc + value);
      const totalRemoved = diffsSummary.map(diffSum => diffSum[1]).reduce((acc, value) => acc + value);
      return (
        <CharterDiffSummary>
          Showing {totalAdded + totalRemoved} edit{totalAdded + totalRemoved !== 1 ? "s" : ""} with{" "}
          <b>
            {totalAdded} addition{totalAdded !== 1 ? "s" : ""}
          </b>{" "}
          and{" "}
          <b>
            {totalRemoved} deletion{totalRemoved !== 1 ? "s" : ""}
          </b>
        </CharterDiffSummary>
      );
    }
    return <></>;
  }

  private renderSelectedCharterRevisionTimestamp(): JSX.Element {
    const { isListingUnderChallenge, charterRevisionId: frozenCharterRevisionId } = this.props;
    let out = <></>;

    const charterTimestamp = this.getSelectedCharterTimestamp();

    if (charterTimestamp) {
      if (isListingUnderChallenge && frozenCharterRevisionId) {
        out = (
          <CharterTimestamp>
            <CharterLockedText>
              Charter is locked on the revision from {charterTimestamp[0]} {charterTimestamp[1]}
            </CharterLockedText>{" "}
            while under challenge.
          </CharterTimestamp>
        );
      } else {
        out = (
          <CharterTimestamp>
            Updated on {charterTimestamp[0]} {charterTimestamp[1]}
          </CharterTimestamp>
        );
      }
    }

    return out;
  }

  private renderCharterRevisionNav(): JSX.Element {
    const { charterRevisions } = this.props;
    const { isDiffModeEnabled } = this.state;

    let selectedRevisionLabel = "";
    if (charterRevisions) {
      if (isDiffModeEnabled) {
        const charterTimestamp = this.getSelectedCharterTimestamp();
        if (charterTimestamp) {
          selectedRevisionLabel = `: ${charterTimestamp[0]}`;
        }
      }

      const navToggleButton = (
        <InvertedButton size={buttonSizes.SMALL}>View edit history{selectedRevisionLabel}</InvertedButton>
      );
      const sortedRevisions = charterRevisions!
        .keySeq()
        .sort((revA, revB) => {
          if (revA < revB) {
            return 1;
          } else if (revA > revB) {
            return -1;
          }
          return 0;
        })
        .toSet();

      return (
        <Dropdown target={navToggleButton} position="right">
          <DropdownGroup>
            {sortedRevisions.map(itemRevisionId => {
              const itemRevision = charterRevisions.get(itemRevisionId!);
              const itemRevisionTimestamp = getLocalDateTimeStrings(itemRevision.timestamp!);
              const selectRevisionId = () => {
                this.selectRevisionId(itemRevisionId!);
              };
              return (
                <DropdownItem onClick={selectRevisionId} key={itemRevision.timestamp!.valueOf()}>
                  {itemRevisionTimestamp[0]} {itemRevisionTimestamp[1]}
                </DropdownItem>
              );
            })}
          </DropdownGroup>
        </Dropdown>
      );
    }

    return <></>;
  }

  private disableDiffMode = (): void => {
    const { charterRevisionId: selectedCharterRevisionId } = this.props;
    this.setState({ selectedCharterRevisionId, isDiffModeEnabled: false });
  };

  private selectRevisionId = (selectedCharterRevisionId: number): void => {
    this.setState({ selectedCharterRevisionId, isDiffModeEnabled: true });
  };
}

const mapStateToProps = (
  state: State,
  ownProps: ListingCharterProps,
): ListingCharterProps & ListingCharterReduxProps => {
  const { content } = state.networkDependent;

  return {
    content,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingCharter);
