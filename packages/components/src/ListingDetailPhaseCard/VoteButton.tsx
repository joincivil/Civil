import * as React from "react";
import { VoteBaseProps } from "./types";
import { buttonSizes, Button, DarkButton } from "../Button";

export interface VoteButtonProps extends VoteBaseProps {
  buttonVoteOptionValue: string;
}

import { buttonTheme } from "./styledComponents";
import { WhitelistActionText, RemoveActionText, UpholdActionText, OverturnActionText } from "./textComponents";

const VoteButton: React.SFC<VoteButtonProps> = props => {
  let buttonText;
  const ButtonComponent = props.voteOption === props.buttonVoteOptionValue ? Button : DarkButton;
  const onClick = () => {
    props.onInputChange({ voteOption: props.buttonVoteOptionValue });
  };
  if (props.buttonVoteOptionValue === "1") {
    buttonText = <>✔ {props.isAppealChallenge ? <OverturnActionText /> : <WhitelistActionText />}</>;
  } else if (props.buttonVoteOptionValue === "0") {
    buttonText = <>✖ {props.isAppealChallenge ? <UpholdActionText /> : <RemoveActionText />}</>;
  }

  return (
    <ButtonComponent onClick={onClick} size={buttonSizes.MEDIUM} theme={buttonTheme}>
      {buttonText}
    </ButtonComponent>
  );
};

export default VoteButton;
