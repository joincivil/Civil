import * as React from "react";
import { StepHeader, StepFormSection, BorderlessButton, WaitForApply, buttonSizes } from "@joincivil/components";
import styled from "styled-components";
import { EthAddress } from "@joincivil/core";
import { connect } from "react-redux";

export interface ApplyToTCRProps {
  address?: EthAddress;
  newsroom?: any;
}

const FormSectionInner = styled("div")`
  padding: 46px;
  background-color: #fffef6;
  opacity: 0.8;
  margin: 16px -38px;
`;

const LearnMoreButton = styled(BorderlessButton)`
  margin-left: 0;
  padding-left: 0;
`;

const P = styled("p")`
  font-size: 14px;
`;

const H = styled("h4")`
  color: #000;
  margin-bottom: 0;
`;

export class ApplyToTCRComponent extends React.Component<ApplyToTCRProps> {
  public render(): JSX.Element {
    return (
      <>
        <StepHeader>Apply to the Civil Registry</StepHeader>
        <StepFormSection>
          <FormSectionInner>
            <WaitForApply />
            <P>
              Your current newsroom application is saved. Thank you for filling out your newsroom application. We are
              launching the Civil Registry soon and you will need to come back to complete your newsroom application
              once that happens.
            </P>
            <P>You are able to edit your application at any time before submission.</P>
            <P>
              You'll recieve a notification message in your WordPress dashboard when you are able to apply to the
              Registry.
            </P>
            <hr />
            <H>What is the Civil Registry?</H>
            <LearnMoreButton
              href="https://cvlconsensys.zendesk.com/hc/en-us/articles/360017687131-What-is-the-Civil-Registry-"
              size={buttonSizes.SMALL}
            >
              Learn More
            </LearnMoreButton>
          </FormSectionInner>
        </StepFormSection>
      </>
    );
  }
}

const mapStateToProps = (state: any, ownProps: ApplyToTCRProps): ApplyToTCRProps => {
  const newsroom = state.newsrooms.get(ownProps.address);

  return {
    ...ownProps,
    newsroom: newsroom ? newsroom.newsroom : null,
  };
};

export const ApplyToTCRPlaceholder = connect(mapStateToProps)(ApplyToTCRComponent);
