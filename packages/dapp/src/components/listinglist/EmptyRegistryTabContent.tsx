import * as React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  buttonSizes,
  RegistryEmptyIcon,
  StyledRegistryEmpty,
  StyledEmptyHeader,
  StyledEmptyCopy,
} from "@joincivil/components";

interface EmptyRegistryTabContent {
  header: string;
  copy: JSX.Element | string;
}

export enum REGISTRY_PHASE_TAB_TYPES {
  APPROVED,
  REJECTED,
  IN_APPLICATION,
  UNDER_CHALLENGE,
  UNDER_APPEAL,
  UNDER_APPEAL_CHALLENGE,
  READY_TO_UPDATE,
}

const EMPTY_REGISTRY_TAB_CONTENT: { [index: number]: EmptyRegistryTabContent } = {
  [REGISTRY_PHASE_TAB_TYPES.APPROVED]: {
    header: "There are no approved newsrooms",
    copy: (
      <>
        You can <Link to="/registry/under-challenge">view new applications</Link> or{" "}
        <Link to="/apply-to-registry">apply to join the Civil Registry</Link>
      </>
    ),
  },
  [REGISTRY_PHASE_TAB_TYPES.REJECTED]: {
    header: "There are no rejected newsrooms",
    copy: (
      <>
        You can <Link to="/registry/in-progress/new-applications">view new applications</Link> or{" "}
        <Link to="/apply-to-registry">apply to join the Civil Registry</Link>
      </>
    ),
  },
  [REGISTRY_PHASE_TAB_TYPES.IN_APPLICATION]: {
    header: "There are no new applications at this time",
    copy: (
      <>
        Join the community-approved ethical Newsrooms on Civil<br />
        <Button to="/apply-to-registry" size={buttonSizes.SMALL}>
          Apply to Registry
        </Button>
      </>
    ),
  },
  [REGISTRY_PHASE_TAB_TYPES.UNDER_CHALLENGE]: {
    header: "There are no newsrooms under challenge at this time",
    copy: (
      <>
        You can <Link to="/registry/approved">view approved newsrooms</Link> or{" "}
        <Link to="/apply-to-registry">apply to Registry</Link>
      </>
    ),
  },
  [REGISTRY_PHASE_TAB_TYPES.UNDER_APPEAL]: {
    header: "There are no appeals to the Civil Council at this time",
    copy: (
      <>
        You can <Link to="/registry/approved">view approved newsrooms</Link> or{" "}
        <Link to="/apply-to-registry">apply to Registry</Link>
      </>
    ),
  },
  [REGISTRY_PHASE_TAB_TYPES.UNDER_APPEAL_CHALLENGE]: {
    header: "There are no Civil Council decisions under challenge at this time",
    copy: (
      <>
        You can <Link to="/registry/approved">view approved newsrooms</Link> or{" "}
        <Link to="/apply-to-registry">apply to Registry</Link>
      </>
    ),
  },
  [REGISTRY_PHASE_TAB_TYPES.READY_TO_UPDATE]: {
    header: "There are no newsrooms with statuses ready to update at this time",
    copy: (
      <>
        You can <Link to="/registry/approved">view approved newsrooms</Link> or{" "}
        <Link to="/apply-to-registry">apply to Registry</Link>
      </>
    ),
  },
};

export interface EmptyRegistryTabContentProps {
  phaseTabType: number;
}

export const EmptyRegistryTabContentComponent: React.SFC<EmptyRegistryTabContentProps> = props => {
  const tabContent = EMPTY_REGISTRY_TAB_CONTENT[props.phaseTabType];
  return (
    <StyledRegistryEmpty>
      <StyledEmptyHeader>{tabContent.header}</StyledEmptyHeader>
      <RegistryEmptyIcon />
      <StyledEmptyCopy>{tabContent.copy}</StyledEmptyCopy>
    </StyledRegistryEmpty>
  );
};
