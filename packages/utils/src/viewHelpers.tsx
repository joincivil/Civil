import * as React from "react";
import { EthAddress } from "@joincivil/typescript-types";
import { BigNumber } from "bignumber.js";
import { Parameters, GovernmentParameters } from "./civilHelpers";

// A collection of helper methods for user-facing views

// Accepts `seconds` as a single argument and returns a
// human-readable string of a duration of time.
// ie: 1 day, 3 hours, 4 minutes, 20 seconds
export function getReadableDuration(seconds: number, fuzzyFilterPeriods: string[] = []): string {
  const periods: Array<[number, string]> = [[86400, "day"], [3600, "hour"], [60, "minute"], [1, "second"]];
  let secondsRemaining: number = seconds;
  const lenPeriods: number = periods.length;
  let fuzzyPeriods: string[] = [];

  if (fuzzyFilterPeriods.length) {
    fuzzyPeriods = periods
      .filter(periodItem => {
        return !fuzzyFilterPeriods.includes(periodItem[1]);
      })
      .map(periodItem => periodItem[1])
      .slice(0, -1);
  }
  let fuzzyPeriodsRemain: boolean = false;
  return periods.reduce((acc: string, item: [number, string], index: number) => {
    const periodUnits = Math.floor(secondsRemaining / item[0]);
    let out: string = acc;
    if (periodUnits > 0) {
      if (!fuzzyPeriodsRemain && fuzzyPeriods.includes(item[1])) {
        fuzzyPeriodsRemain = true;
      }
      if (!fuzzyFilterPeriods.includes(item[1]) || !fuzzyPeriodsRemain) {
        out += `${periodUnits} ${item[1]}${periodUnits !== 1 ? "s" : ""}${index < lenPeriods - 1 ? " " : ""}`;
      }
      secondsRemaining = secondsRemaining % item[0];
    }
    return out;
  }, "");
}

export function getFormattedEthAddress(ethAddress: EthAddress): string {
  const out: [string, string[]] = [ethAddress.substring(0, 2), ethAddress.substring(2).split("")];
  const lenRest = out[1].length;
  for (let i = 3; i < lenRest; i = i + 4) {
    out[1][i] = out[1][i] + " ";
  }
  return `${out[0]} ${out[1].join("")}`;
}

// accepts token balance in lowest-level form (no decimals). Converts to readable format (18 decimal places; cut off at 2)
export function getFormattedTokenBalance(balance: BigNumber, noCVLLabel?: boolean, decimals: number = 2): string {
  // TODO: get decimal places value from EIP20 wrapper
  const formattedBalance = balance.div(1e18);
  return `${formattedBalance.toFormat(decimals)} ${!!noCVLLabel ? "" : "CVL"}`;
}

// Accepts a `seconds` or `Date` argument and returns a tuple containing
// localized Date and Time strings in a human-readable format
export function getLocalDateTimeStrings(seconds: number | Date): [string, string] {
  const theDate = typeof seconds === "number" ? new Date(seconds * 1000) : seconds;
  const pad = (num: number | string) => {
    return padString(num, 2, "0");
  };
  const hours = pad(theDate.getHours());
  const mins = pad(theDate.getMinutes());
  const tzOffset = `${pad(theDate.getTimezoneOffset() / 60)}${pad(theDate.getTimezoneOffset() % 60)}`;
  const dateString = `${theDate.getFullYear()}-${theDate.getMonth() + 1}-${theDate.getDate()}`;
  const timeString = `${hours}:${mins} GMT-${tzOffset}`;
  return [dateString, timeString];
}

export function padString(value: number | string, places: number, char: string, append: boolean = false): string {
  let out = typeof value === "number" ? value.toString() : value;
  while (out.length < places) {
    if (append) {
      out += char;
    } else {
      out = char + out;
    }
  }
  return out;
}

export function getNumberStringWithCommaDelimeters(
  num: number | string,
  delim: string = ",",
  places: number = 3,
): string {
  const numString = typeof num === "number" ? num.toString() : num;
  const lenStr = numString.length;
  const out = numString.split("").reverse();
  for (let i = places; i < lenStr; i = i + places) {
    out[i] = out[i] + ",";
  }
  return out.reverse().join("");
}

export const amountParams: string[] = [Parameters.minDeposit, Parameters.pMinDeposit, GovernmentParameters.appealFee];

export const durationParams: string[] = [
  Parameters.applyStageLen,
  Parameters.pApplyStageLen,
  Parameters.commitStageLen,
  Parameters.pCommitStageLen,
  Parameters.revealStageLen,
  Parameters.pRevealStageLen,
  Parameters.challengeAppealLen,
  Parameters.challengeAppealCommitLen,
  Parameters.challengeAppealRevealLen,
  GovernmentParameters.requestAppealLen,
  GovernmentParameters.judgeAppealLen,
  GovernmentParameters.govtPCommitStageLen,
  GovernmentParameters.govtPRevealStageLen,
];

export const percentParams: string[] = [
  Parameters.dispensationPct,
  Parameters.pDispensationPct,
  Parameters.voteQuorum,
  Parameters.pVoteQuorum,
  GovernmentParameters.appealVotePercentage,
  GovernmentParameters.appealChallengeVoteDispensationPct,
];

export function getFormattedParameterValue(parameterName: string, parameterValue: BigNumber | number): string {
  let value = "";
  const parameterValueBN = new BigNumber(parameterValue);

  if (amountParams.includes(parameterName)) {
    value = getFormattedTokenBalance(parameterValueBN);
  } else if (durationParams.includes(parameterName)) {
    value = getReadableDuration(parameterValueBN.toNumber());
  } else if (percentParams.includes(parameterName)) {
    value = `${parameterValueBN.toString()}%`;
  }

  return value;
}

export function renderPTagsFromLineBreaks(text: string, wrapperComponent?: any): JSX.Element {
  if (!text) {
    return <></>;
  }
  if (wrapperComponent) {
    /* tslint:disable-next-line */
    const LineWrapperComponent = wrapperComponent;
    return (
      <>
        {text
          .split("\n")
          .filter(line => !!line)
          .map((line, i) => (
            <p key={i}>
              <LineWrapperComponent>{line}</LineWrapperComponent>
            </p>
          ))}
      </>
    );
  }
  return (
    <>
      {text
        .split("\n")
        .filter(line => !!line)
        .map((line, i) => <p key={i}>{line}</p>)}
    </>
  );
}
