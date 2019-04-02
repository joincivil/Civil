import * as React from "react";
import styled from "styled-components";
import { VoteBaseProps } from "./types";
import { colors } from "../styleConstants";
import { buttonSizes, Button, InvertedButton } from "../Button";
import { HollowGreenCheck, HollowRedNoGood } from "../icons";

const StyledVoteButton = styled.span`
  flex-grow: 1;

  svg {
    margin: 0 8px -3px 0;
  }

  ${Button}, ${InvertedButton} {
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 0;
    line-height: 14px;
    padding: 18px 0;
    text-transform: uppercase;
    width: 100%;
  }

  ${Button} {
    border: 2px solid ${colors.accent.CIVIL_BLUE};
    border-radius: 2px;
  }

  ${InvertedButton}:hover .svg-fill {
    fill: ${colors.basic.WHITE};
  }

  ${InvertedButton}:hover .svg-stroke {
    stroke: ${colors.basic.WHITE};
  }
`;

export interface VoteButtonProps extends VoteBaseProps {
  buttonVoteOptionValue: string;
}

import { buttonTheme } from "./styledComponents";
import { WhitelistActionText, RemoveActionText, UpholdActionText, OverturnActionText } from "./textComponents";

const VoteButton: React.FunctionComponent<VoteButtonProps> = props => {
  let buttonText;
  const { voteOption, buttonVoteOptionValue, isAppealChallenge } = props;
  const isSelected = voteOption === buttonVoteOptionValue;
  const ButtonComponent = isSelected ? Button : InvertedButton;
  const iconColor = isSelected ? colors.basic.WHITE : colors.accent.CIVIL_BLUE;
  const onClick = () => {
    props.onInputChange({ voteOption: buttonVoteOptionValue });
  };
  if (buttonVoteOptionValue === "1") {
    if (isAppealChallenge) {
      buttonText = <OverturnActionText />;
    } else {
      buttonText = (
        <>
          <HollowGreenCheck width={17} height={17} color={iconColor} /> <WhitelistActionText />
        </>
      );
    }
  } else if (props.buttonVoteOptionValue === "0") {
    if (props.isAppealChallenge) {
      buttonText = <UpholdActionText />;
    } else {
      buttonText = (
        <>
          <HollowRedNoGood width={17} height={17} color={iconColor} /> <RemoveActionText />
        </>
      );
    }
  }

  return (
    <StyledVoteButton>
      <ButtonComponent onClick={onClick} size={buttonSizes.MEDIUM} theme={buttonTheme}>
        {buttonText}
      </ButtonComponent>
    </StyledVoteButton>
  );
};

export default VoteButton;
