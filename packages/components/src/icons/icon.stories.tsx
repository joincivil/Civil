import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import {
  ApplicationInProgressIcon,
  ApprovedNewsroomsIcon,
  ArticleIndexIcon,
  ArticleIndexPanelIcon,
  ArticleSignIcon,
  ArticleSignPanelIcon,
  CvlToken,
  ClockIcon,
  CloseXIcon,
  CommitVoteSuccessIcon,
  ExpandDownArrow,
  FacebookIcon,
  GreenCheckMark,
  HamburgerIcon,
  HollowGreenCheck,
  HollowRedNoGood,
  MetaMaskSideIcon,
  MetaMaskFrontIcon,
  NorthEastArrow,
  OctopusErrorIcon,
  RegistryEmptyIcon,
  RejectedNewsroomsIcon,
  RevealVoteSuccessIcon,
  RequestAppealSuccessIcon,
  SubmitChallengeSuccessIcon,
  TwitterIcon,
  WarningIcon,
  WaitForApply,
} from "./index";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const Container: React.StatelessComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("SVG Icons", module)
  .add("ApplicationInProgressIcon", () => {
    return (
      <Container>
        <ApplicationInProgressIcon />
      </Container>
    );
  })
  .add("ApprovedNewsroomsIcon", () => {
    return (
      <Container>
        <ApprovedNewsroomsIcon />
      </Container>
    );
  })
  .add("ArticleIndexIcon", () => {
    return (
      <Container>
        <ArticleIndexIcon />
      </Container>
    );
  })
  .add("ArticleIndexPanelIcon", () => {
    return (
      <Container>
        <ArticleIndexPanelIcon />
      </Container>
    );
  })
  .add("ArticleSignIcon", () => {
    return (
      <Container>
        <ArticleSignIcon />
      </Container>
    );
  })
  .add("ArticleSignPanelIcon", () => {
    return (
      <Container>
        <ArticleSignPanelIcon />
      </Container>
    );
  })
  .add("CVLToken", () => {
    return (
      <Container>
        <CvlToken />
      </Container>
    );
  })
  .add("ClockIcon", () => {
    return (
      <Container>
        <ClockIcon />
      </Container>
    );
  })
  .add("CLoseXIcon", () => {
    return (
      <Container>
        <CloseXIcon />
      </Container>
    );
  })
  .add("CommitVoteSuccessIcon", () => {
    return (
      <Container>
        <CommitVoteSuccessIcon />
      </Container>
    );
  })
  .add("ExpandDownArrow", () => {
    return (
      <Container>
        <ExpandDownArrow />
      </Container>
    );
  })
  .add("FacebookIcon", () => {
    return (
      <Container>
        <FacebookIcon />
      </Container>
    );
  })
  .add("GreenCheckMark", () => {
    return (
      <Container>
        <GreenCheckMark />
      </Container>
    );
  })
  .add("HamburgerIcon", () => {
    return (
      <Container>
        <HamburgerIcon />
      </Container>
    );
  })
  .add("HollowGreenCheck", () => {
    return (
      <Container>
        <HollowGreenCheck />
      </Container>
    );
  })
  .add("HollowRedNoGood", () => {
    return (
      <Container>
        <HollowRedNoGood />
      </Container>
    );
  })
  .add("MetaMaskSideIcon", () => {
    return (
      <Container>
        <MetaMaskSideIcon />
      </Container>
    );
  })
  .add("MetaMaskFrontIcon", () => {
    return (
      <Container>
        <MetaMaskFrontIcon />
      </Container>
    );
  })
  .add("NorthEastArrow", () => {
    return (
      <Container>
        <NorthEastArrow />
      </Container>
    );
  })
  .add("OctopusErrorIcon", () => {
    return (
      <Container>
        <OctopusErrorIcon />
      </Container>
    );
  })
  .add("RegistryEmptyIcon", () => {
    return (
      <Container>
        <RegistryEmptyIcon />
      </Container>
    );
  })
  .add("RejectedNewsroomsIcon", () => {
    return (
      <Container>
        <RejectedNewsroomsIcon />
      </Container>
    );
  })
  .add("RevealVoteSuccessIcon", () => {
    return (
      <Container>
        <RevealVoteSuccessIcon />
      </Container>
    );
  })
  .add("RequestAppealSuccessIcon", () => {
    return (
      <Container>
        <RequestAppealSuccessIcon />
      </Container>
    );
  })
  .add("SubmitChallengeSuccessIcon", () => {
    return (
      <Container>
        <SubmitChallengeSuccessIcon />
      </Container>
    );
  })
  .add("TwitterIcon", () => {
    return (
      <Container>
        <TwitterIcon />
      </Container>
    );
  })
  .add("WarningIcon", () => {
    return (
      <Container>
        <WarningIcon />
      </Container>
    );
  })
  .add("WaitForApply", () => {
    return (
      <Container>
        <WaitForApply />
      </Container>
    );
  });
