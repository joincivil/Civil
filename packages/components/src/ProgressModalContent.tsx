import * as React from "react";
import styled from "styled-components";
import { LoadingIndicator } from "./LoadingIndicator";
import { ModalHeading, ModalContent, ModalContentInsetContainer, StyledModalErrorContainer } from "./ModalContent";
import { Button, buttonSizes } from "./Button";
import { OctopusErrorIcon } from "./icons";

export interface ProgressModalContentProps {
  hideModal?(): void;
}

export const ProgressModalContentInProgress: React.SFC<ProgressModalContentProps> = props => {
  const content = props.children || <ModalHeading>Your transaction is in progress.</ModalHeading>;

  return (
    <>
      <LoadingIndicator height={100} width={150} />
      {content}
      <ModalContentInsetContainer>
        <ModalContent>
          Your transaction is processing. This can take 1-3 minutes. Please don't close the tab.
        </ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </ModalContentInsetContainer>
    </>
  );
};

export const ProgressModalContentSuccess: React.SFC<ProgressModalContentProps> = props => {
  const handleOnClick = (event: any): void => {
    if (props.hideModal) {
      props.hideModal();
    }
  };

  return (
    <>
      <ModalHeading>Success!</ModalHeading>

      <ModalContentInsetContainer>
        <ModalContent>Transaction processed.</ModalContent>
      </ModalContentInsetContainer>

      <Button onClick={handleOnClick} size={buttonSizes.MEDIUM}>
        Ok!
      </Button>
    </>
  );
};

export const ProgressModalContentError: React.SFC<ProgressModalContentProps> = props => {
  const handleOnClick = (event: any): void => {
    if (props.hideModal) {
      props.hideModal();
    }
  };

  if (props.children) {
    return (
      <>
        <StyledModalErrorContainer>
          <OctopusErrorIcon />
        </StyledModalErrorContainer>
        {props.children}
        <Button onClick={handleOnClick} size={buttonSizes.MEDIUM}>
          Dismiss
        </Button>
      </>
    );
  }

  return (
    <>
      <StyledModalErrorContainer>
        <OctopusErrorIcon />
      </StyledModalErrorContainer>
      <ModalHeading>Uh oh!</ModalHeading>
      <ModalContent>Your transaction failed. Please try again.</ModalContent>
      <Button onClick={handleOnClick} size={buttonSizes.MEDIUM}>
        Dismiss
      </Button>
    </>
  );
};

export const ProgressModalContentMobileUnsupported: React.SFC<ProgressModalContentProps> = props => {
  const handleOnClick = (event: any): void => {
    if (props.hideModal) {
      props.hideModal();
    }
  };

  return (
    <>
      <StyledModalErrorContainer>
        <OctopusErrorIcon />
      </StyledModalErrorContainer>

      <ModalHeading>We're sorry, this action is only available on desktop.</ModalHeading>
      <ModalContentInsetContainer>
        <ModalContent>
          Transactions requiring MetaMask on mobile are not available yet, but they're coming. In the meantime, you can
          still browse newsroom listings on our site.
        </ModalContent>
      </ModalContentInsetContainer>

      <Button onClick={handleOnClick} size={buttonSizes.MEDIUM}>
        Continue
      </Button>
    </>
  );
};
