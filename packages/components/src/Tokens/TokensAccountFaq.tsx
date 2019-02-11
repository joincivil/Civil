import * as React from "react";
import { TokenFAQCollapse } from "./TokensStyledComponents";
import {
  TokenETHFAQQuestion1Text,
  TokenETHFAQQuestion2Text,
  TokenETHFAQQuestion3Text,
  TokenETHFAQQuestion4Text,
  TokenETHFAQQuestion5Text,
  TokenETHFAQQuestion6Text,
} from "./TokensTextComponents";
import { Collapsable } from "../Collapsable";

export const UserTokenAccountFaq: React.StatelessComponent = props => {
  return (
    <>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion1Text />} open={false}>
          <p>TKTKTK</p>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion2Text />} open={false}>
          <p>TKTKTK</p>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion3Text />} open={false}>
          <p>TKTKTK</p>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion4Text />} open={false}>
          <p>TKTKTK</p>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion5Text />} open={false}>
          <p>TKTKTK</p>
        </Collapsable>
      </TokenFAQCollapse>
      <TokenFAQCollapse>
        <Collapsable header={<TokenETHFAQQuestion6Text />} open={false}>
          <p>TKTKTK</p>
        </Collapsable>
      </TokenFAQCollapse>
    </>
  );
};
