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
  BellIcon,
  CivilTutorialIcon,
  ClockIcon,
  CloseXIcon,
  CommitVoteSuccessIcon,
  CvlToken,
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
  RequestAppealSuccessIcon,
  RevealVoteSuccessIcon,
  SubmitChallengeSuccessIcon,
  TokenWalletIcon,
  TwitterIcon,
  VerifyIdentityIcon,
  WaitForApply,
  WarningIcon,
} from "./index";

const StyledDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
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
  .add("BellIcon", () => {
    return (
      <Container>
        <BellIcon />
      </Container>
    );
  })
  .add("CivilTutorialIcon", () => {
    return (
      <Container>
        <CivilTutorialIcon />
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
  .add("CloseXIcon", () => {
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
  .add("CVLToken", () => {
    return (
      <Container>
        <CvlToken />
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
  .add("RequestAppealSuccessIcon", () => {
    return (
      <Container>
        <RequestAppealSuccessIcon />
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
  .add("SubmitChallengeSuccessIcon", () => {
    return (
      <Container>
        <SubmitChallengeSuccessIcon />
      </Container>
    );
  })
  .add("TokenWalletIcon", () => {
    return (
      <Container>
        <TokenWalletIcon />
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
  .add("VerifyIdentityIcon", () => {
    return (
      <Container>
        <VerifyIdentityIcon />
      </Container>
    );
  })
  .add("WaitForApply", () => {
    return (
      <Container>
        <WaitForApply />
      </Container>
    );
  })
  .add("WarningIcon", () => {
    return (
      <Container>
        <WarningIcon />
      </Container>
    );
  });
