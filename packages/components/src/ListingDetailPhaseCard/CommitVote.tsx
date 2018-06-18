import * as React from "react";
import { EthAddress } from "@joincivil/core";
import { buttonSizes, DarkButton } from "../Button";
import { InputGroup, TextInput } from "../input/";
import {
  FormHeader,
  FormCopy,
  AccentHRule,
  FormQuestion,
  VoteOptionsContainer,
  StyledOrText,
} from "./styledComponents";

export class CommitVote extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <FormHeader>You’re invited to vote!</FormHeader>
        <FormCopy>Vote with your CVL tokens, and help curate credible, trustworthy journalism on Civil.</FormCopy>
        <AccentHRule />

        <FormQuestion>Should this newsroom remain or be removed from the Civil Registry?</FormQuestion>

        <InputGroup
          prepend="CVL"
          label="Enter amount of tokens to vote"
          placeholder="Enter a value"
          name="TextInput"
          onChange={this.onChange}
        />

        <TextInput label="Enter your salt" placeholder="Enter a value" name="TextInput" onChange={this.onChange} />

        <VoteOptionsContainer>
          <DarkButton size={buttonSizes.MEDIUM}>✔ Remain</DarkButton>
          <StyledOrText>or</StyledOrText>
          <DarkButton size={buttonSizes.MEDIUM}>✖ Remove</DarkButton>
        </VoteOptionsContainer>
      </>
    );
  }

  private onChange = (): void => {
    return;
  };
}
