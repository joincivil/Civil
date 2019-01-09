import * as React from "react";
import { CharterData } from "@joincivil/core";
import { NewsroomBio } from "./NewsroomBio";

export interface NewsroomProfileState {
  currentStep: number,
};

export interface NewsroomProfileProps {
  charter: Partial<CharterData>;
  updateCharter(charter: Partial<CharterData>): void;
  goNext?(): void;
}

export class NewsroomProfile extends React.Component<NewsroomProfileProps, NewsroomProfileState> {
  constructor(props: NewsroomProfileProps) {
    super(props);
    this.state = {
      currentStep: 0
    };
  }
  public renderCurrentStep(): JSX.Element {
    const steps = [
      <NewsroomBio charter={this.props.charter} updateCharter={this.props.updateCharter}/>
    ];
    return steps[this.state.currentStep];
  }
  public goNext(): void {
    this.setState({currentStep: this.state.currentStep + 1});
  }
  public render(): JSX.Element {
    return (<>
      {this.renderCurrentStep()}
      <div>
        <button>back</button>
        <button onClick={() => this.goNext()}>next</button>
      </div>
    </>);
  }
}
