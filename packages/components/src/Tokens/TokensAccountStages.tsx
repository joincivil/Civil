import * as React from "react";
import {
  TokenStages,
  TokenStage,
  MainContentFooter,
  TokenButtons,
  TokenStageIcon,
  TokenStageHeader,
  TokenStageDescription,
} from "./TokensStyledComponents";
import {
  TokenConnectWalletHeaderText,
  TokenConnectWalletInfoText,
  TokenConnectWalletBtnText,
  TokenQuizHeaderText,
  TokenQuizInfoText,
  TokenQuizBtnText,
  TokenVerifyHeaderText,
  TokenVerifyInfoText,
  TokenVerifyBtnText,
  TokenBuyBtnText,
} from "./TokensTextComponents";
import { TokenAddWalletIcon } from "../icons/TokenAddWalletIcon";
import { TokenIdentityIcon } from "../icons/TokenIdentityIcon";
import { TokenTutorialIcon } from "../icons/TokenTutorialIcon";

export const UserTokenAccountStages: React.StatelessComponent = props => {
  return (
    <TokenStages>
      <TokenStage>
        <TokenStageIcon>
          <TokenAddWalletIcon />
        </TokenStageIcon>
        <TokenStageHeader>
          <TokenConnectWalletHeaderText />
        </TokenStageHeader>
        <TokenStageDescription>
          <TokenConnectWalletInfoText />
        </TokenStageDescription>
        <TokenButtons>
          <TokenConnectWalletBtnText />
        </TokenButtons>
      </TokenStage>
      <TokenStage>
        <TokenStageIcon>
          <TokenTutorialIcon />
        </TokenStageIcon>
        <TokenStageHeader>
          <TokenQuizHeaderText />
        </TokenStageHeader>
        <TokenStageDescription>
          <TokenQuizInfoText />
        </TokenStageDescription>
        <TokenButtons>
          <TokenQuizBtnText />
        </TokenButtons>
      </TokenStage>
      <TokenStage>
        <TokenStageIcon>
          <TokenIdentityIcon />
        </TokenStageIcon>
        <TokenStageHeader>
          <TokenVerifyHeaderText />
        </TokenStageHeader>
        <TokenStageDescription>
          <TokenVerifyInfoText />
        </TokenStageDescription>
        <TokenButtons>
          <TokenVerifyBtnText />
        </TokenButtons>
      </TokenStage>
      <MainContentFooter>
        <TokenButtons>
          <TokenBuyBtnText />
        </TokenButtons>
      </MainContentFooter>
    </TokenStages>
  );
};
