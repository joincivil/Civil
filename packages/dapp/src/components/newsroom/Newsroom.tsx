import * as React from "react";
import { FormHeading, StepProcess } from "@joincivil/components";
import { NameAndAddress } from "./NameAndAddress";
import { CompleteYourProfile } from "./CompleteYourProfile";

export class Newsroom extends React.Component {
  public render(): JSX.Element {
    return (<>
      <FormHeading>Newsroom Application</FormHeading>
      <p>Set up your newsroom smart contract and get started publishing on Civil.</p>
      <StepProcess>
        <NameAndAddress/>
        <CompleteYourProfile/>
      </StepProcess>
    </>);
  }
}
