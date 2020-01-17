import * as React from "react";
import { debounce } from "lodash";

import { QuestionToolTip, HelmetHelper, CurrencyInput } from "@joincivil/components";
import { renderPTagsFromLineBreaks } from "@joincivil/utils";

import { BoostProgress } from "./BoostProgress";
import { BoostData, BoostNewsroomData } from "./types";
import {
  BoostButton,
  BoostFlexCenter,
  BoostWrapper,
  BoostTitle,
  BoostDescription,
  BoostDescriptionWhy,
  BoostDescriptionTable,
  BoostProgressCol,
  BoostNotice,
  BoostNotificationContain,
  BoostAmountInputWrap,
  BoostAmountInput,
  BoostDescShareFlex,
  BoostCardShare,
} from "./BoostStyledComponents";
import { BoostPaymentSuccess } from "./BoostTextComponents";
import { BoostNewsroom } from "./BoostNewsroom";
import { BoostCompleted } from "./BoostCompleted";
import * as boostCardImage from "../../images/boost-card.png";
import { urlConstants } from "../urlConstants";
import { BoostCardListView } from "./BoostCardListView";

export interface BoostCardProps {
  boostData: BoostData;
  newsroomData: BoostNewsroomData;
  handle?: string;
  open: boolean;
  boostId: string;
  paymentSuccess: boolean;
  boostOwner?: boolean;
  disableHelmet?: boolean;
  handlePayments(amount: number): void;
}

export interface BoostCardStates {
  amount: number;
}

export class BoostCard extends React.Component<BoostCardProps, BoostCardStates> {
  public amountInputEl?: HTMLElement | null;

  public constructor(props: any) {
    super(props);
    this.state = {
      amount: 0,
    };

    this.handleAmount = debounce(this.handleAmount.bind(this), 300);
  }
  public render(): JSX.Element {
    const { open, boostData, newsroomData, boostId, paymentSuccess, boostOwner, disableHelmet, handle } = this.props;
    const timeRemaining = this.timeRemaining(boostData.dateEnd);
    const timeEnded = timeRemaining === "Boost Ended";
    const goalReached = boostData.paymentsTotal >= boostData.goalAmount;
    const newsroomContractAddress = boostData.channel.newsroom.contractAddress;
    let btnText = "Support";
    if (timeEnded) {
      btnText = "Boost Ended";
    }
    const inputDisabled = timeEnded || !newsroomData.whitelisted;

    if (!open) {
      return (
        <BoostCardListView
          open={open}
          boostData={boostData}
          newsroomData={newsroomData}
          handle={handle}
          boostId={boostId}
          boostOwner={boostOwner}
          disableHelmet={disableHelmet}
          timeRemaining={timeRemaining}
          newsroomContractAddress={newsroomContractAddress}
        />
      );
    }

    return (
      <>
        {!disableHelmet && (
          <HelmetHelper
            title={`${boostData.title} - ${newsroomData.name} - The Civil Registry`}
            description={boostData.about}
            image={boostCardImage}
            meta={{
              "og:site_name": "Civil Registry",
              "og:type": "website",
              "twitter:card": "summary",
            }}
          />
        )}

        {boostOwner && timeEnded && (
          <BoostNotificationContain>
            <BoostCompleted goalReached={goalReached} />
          </BoostNotificationContain>
        )}
        {paymentSuccess && (
          <BoostNotificationContain>
            <BoostPaymentSuccess />
          </BoostNotificationContain>
        )}

        <BoostWrapper open={open}>
          <BoostTitle>{boostData.title}</BoostTitle>

          <BoostNewsroom
            open={open}
            boostOwner={boostOwner}
            boostId={boostId}
            newsroomContractAddress={newsroomContractAddress}
            charterUri={newsroomData.charter && newsroomData.charter.uri}
            newsroomData={newsroomData}
            handle={handle}
            disableHelmet={disableHelmet}
          />

          <BoostFlexCenter>
            <BoostProgressCol open={open}>
              <BoostProgress
                open={open}
                goalAmount={boostData.goalAmount}
                paymentsTotal={boostData.paymentsTotal}
                timeRemaining={timeRemaining}
              />
            </BoostProgressCol>
            <BoostAmountInputWrap>
              <BoostAmountInput>
                <CurrencyInput
                  label={""}
                  placeholder={"0"}
                  name={"BoostAmount"}
                  onChange={this.handleAmount}
                  disabled={inputDisabled}
                  inputRef={el => {
                    this.amountInputEl = el;
                  }}
                />
              </BoostAmountInput>
              <BoostButton disabled={inputDisabled} onClick={this.handleBoostButton}>
                {btnText}
              </BoostButton>
            </BoostAmountInputWrap>
          </BoostFlexCenter>
          {!newsroomData.whitelisted && (
            <>
              <BoostNotice>
                The newsroom that created this Project Boost has been removed from the registry, so users can no longer
                support it via this Project Boost.
              </BoostNotice>
            </>
          )}
          <BoostNotice>
            All funds raised will go directly to the newsroom even if this goal is not met.
            <QuestionToolTip
              explainerText={
                "Any money you give goes directly to the newsroom. Civil does not take a cut of any funds raised."
              }
            />
          </BoostNotice>
          <BoostDescShareFlex>
            <BoostDescriptionWhy>{renderPTagsFromLineBreaks(boostData.why)}</BoostDescriptionWhy>
            <div>
              <BoostCardShare
                boostId={this.props.boostId}
                newsroom={this.props.newsroomData.name}
                title={boostData.title}
              />
            </div>
          </BoostDescShareFlex>
          <BoostDescription>
            <h3>What the outcome will be</h3>
            {renderPTagsFromLineBreaks(boostData.what)}
          </BoostDescription>
          <BoostDescription>
            <h3>About the newsroom</h3>
            {renderPTagsFromLineBreaks(boostData.about)}
          </BoostDescription>
          <BoostDescriptionTable>
            <h3>Where your support goes</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {boostData.items.map((item: any, i: number) => (
                  <tr key={i}>
                    <td>{item.item}</td>
                    <td>{"$" + item.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </BoostDescriptionTable>
          <BoostDescription>
            <h3>Questions about Project Boosts?</h3>
            <p>
              <a target="_blank" href={urlConstants.FAQ_BOOSTS}>
                Learn more in our FAQ
              </a>
            </p>
          </BoostDescription>
        </BoostWrapper>
      </>
    );
  }

  private handleBoostButton = () => {
    if (!this.state.amount) {
      if (this.amountInputEl) {
        this.amountInputEl.focus();
      }
      return;
    }
    this.props.handlePayments(this.state.amount);
  };

  private handleAmount = (name: string, value: any) => {
    let amount = Number.parseFloat(value);
    if (isNaN(amount)) {
      amount = 0;
    }
    this.setState({ amount });
  };

  // TODO(sruddy) add to util
  private timeRemaining = (dateEnd: string) => {
    const endDate = Date.parse(dateEnd);
    const currentDate = Date.now();
    let timeRemainingSeconds = (endDate - currentDate) / 1000;
    let timeRemaining;

    if (timeRemainingSeconds <= 0) {
      return (timeRemaining = "Boost Ended");
    }

    const days = Math.floor(timeRemainingSeconds / (3600 * 24));
    timeRemainingSeconds -= days * 3600 * 24;
    const hours = Math.floor(timeRemainingSeconds / 3600);
    timeRemainingSeconds -= hours * 3600;
    const mins = Math.floor(timeRemainingSeconds / 60);

    if (days >= 1) {
      timeRemaining = days === 1 ? "1 day left" : days + " days left";
    } else if (days < 1 && hours >= 1) {
      timeRemaining = hours === 1 ? "1 hour left" : hours + " hours left";
    } else if (hours < 1 && mins > 1) {
      timeRemaining = mins + " minutes left";
    } else if (mins <= 1 && mins > 0) {
      timeRemaining = "1 minute left";
    } else {
      timeRemaining = "Boost Ended";
    }

    return timeRemaining;
  };
}
