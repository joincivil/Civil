import * as React from "react";
import { InvertedButton, buttonSizes } from "@joincivil/components";
import { urlConstants } from "@joincivil/utils";
import { InfoModalButton, Header, SectionHeader, Paragraph } from "../InfoModalButton";

export class AboutApplicationButton extends React.Component {
  public render(): JSX.Element | null {
    return (
      <InfoModalButton
        buttonText="Learn more about the Application Review Process"
        content={
          <>
            <Header>About Application Review</Header>
            <Paragraph>In this section we'll help explain your Newsroom Application Review process.</Paragraph>

            <SectionHeader>Application Deposit</SectionHeader>
            {/*@TODO/toby Populate from parameterizer*/}
            <Paragraph>
              Once your application is complete, you can submit your application to the Registry for review. You need to
              stake 5,000 Civil tokens with your application.
            </Paragraph>
            <Paragraph>
              If your Newsroom wallet doesn’t have enough tokens, you can add more Civil tokens to your Newsroom wallet.
              Don’t worry, we’ll guide you along that process before you apply.
            </Paragraph>

            <SectionHeader>Applying to the Registry</SectionHeader>
            {/*@TODO/toby Populate from parameterizer*/}
            <Paragraph>
              You will need to stake 5,000 Civil tokens with your application. This is to signal the seriousness of your
              intent to the community.
            </Paragraph>
            <Paragraph>
              Once you have applied, your application for the Registry will be up for community vote and review on the
              Application in Review tab of the Civil Registry for 14 days. A newsroom will be approved if there are no
              sucessful challenges.
            </Paragraph>
            <Paragraph>
              During that time period, any CVL token holder may challenge this newsroom by matching the application
              deposit if they believe the newsroom’s mission, charter or roster is in any way a violation of the
              principles of the{" "}
              <a href={urlConstants.CONSTITUTION} target="_blank">
                Civil Constitution
              </a>. If there are no challenges, this newsroom will be automatically approved. By applying to the{" "}
              <a href={urlConstants.REGISTRY} target="_blank">
                Civil Registry
              </a>, newsroom is committed to upholding the values of the{" "}
              <a href={urlConstants.CONSTITUTION} target="_blank">
                Civil Constitution
              </a>.
            </Paragraph>
            <Paragraph>
              The Registry is designed with checks and balances in place to ensure that all voices and perspectives have
              an opportunity to be heard in the Civil community. You can learn more about the review and challenge
              phases{" "}
              <a href={urlConstants.FAQ_COMMUNITY_VETTING_PROCESS} target="_blank">
                here
              </a>.
            </Paragraph>

            <InvertedButton size={buttonSizes.SMALL} target="_blank" href={urlConstants.FAQ_HOME}>
              Read more on our FAQ
            </InvertedButton>
          </>
        }
      />
    );
  }
}
