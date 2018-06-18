import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { EthAddress } from "@joincivil/core";
import { colors, fonts } from "../styleConstants";
import { buttonSizes, Button, DarkButton, InvertedButton } from "../Button";
import { InputGroup, TextInput } from "../input/";
import { VoteOptionsContainer, StyledOrText, FormHeader, FormCopy } from "./styledComponents";

export class RevealVote extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <FormHeader>Verify Your Votes and Make Them Count!</FormHeader>
        <FormCopy>Votes are counted when you verify yours.</FormCopy>
        <FormCopy>
          Please use your pass phrase to verify your votes below. Your pass phrase was created at the time when you
          voted for this challenge.{" "}
        </FormCopy>

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
