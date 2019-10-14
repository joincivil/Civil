import * as React from "react";
import { renderPTagsFromLineBreaks } from "@joincivil/utils";
import { BoostData, BoostNewsroomData } from "./types";
import {
  BoostWrapperLink,
  BoostTitle,
  BoostFlexCenter,
  BoostProgressCol,
  BoostDescriptionWhy,
} from "./BoostStyledComponents";
import { BoostNewsroom } from "./BoostNewsroom";
import { BoostProgress } from "./BoostProgress";

export interface BoostCardListViewProps {
  open: boolean;
  boostData: BoostData;
  newsroomData: BoostNewsroomData;
  boostId: string;
  boostOwner?: boolean;
  disableHelmet?: boolean;
  timeRemaining: string;
  newsroomContractAddress: string;
}

export class BoostCardListView extends React.Component<BoostCardListViewProps> {
  public render(): JSX.Element {
    const {
      open,
      boostData,
      newsroomData,
      boostId,
      boostOwner,
      disableHelmet,
      timeRemaining,
      newsroomContractAddress,
    } = this.props;

    return (
      <BoostWrapperLink to={"/boosts/" + boostId}>
        <BoostTitle>{boostData.title}</BoostTitle>

        <BoostNewsroom
          open={open}
          boostOwner={boostOwner}
          boostId={boostId}
          newsroomContractAddress={newsroomContractAddress}
          charterUri={newsroomData.charter && newsroomData.charter.uri}
          newsroomData={newsroomData}
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
        </BoostFlexCenter>
        <BoostDescriptionWhy>{this.truncateDescription(boostData.why)}</BoostDescriptionWhy>
      </BoostWrapperLink>
    );
  }

  private truncateDescription = (description: string) => {
    const descriptionLength = description.length;
    const truncateDescription = descriptionLength >= 140 ? description.substr(0, 140) + "\u2026" : description;
    return renderPTagsFromLineBreaks(truncateDescription);
  };
}
