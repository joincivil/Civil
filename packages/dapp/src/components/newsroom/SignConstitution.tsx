import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../../reducers";
import { addGovernmentData } from "../../actionCreators/government";
import { getConstitutionHash, getConstitutionUri, getNewsroom, signMessage } from "../../apis/civilTCR";
import { Button, StepHeader, StepProps, StepStyled, Collapsable, FormHeading } from "@joincivil/components";
import styled from "styled-components";
import { Map } from "immutable";

const StyledLegalIframe = styled.iframe`
  height: 15rem;
  width: 100%;
`;

export interface SignConstitutionReduxProps {
  ui: Map<string, any>;
  government: Map<string, string>;
  user: any;
};

export interface SignConstitutionState {
  isOwnerOfNewsroom?: boolean;
}

class SignConstitution extends React.Component<DispatchProp<any> & StepProps & SignConstitutionReduxProps, SignConstitutionState> {

  constructor(props: StepProps & SignConstitutionReduxProps) {
    super(props);
    this.state = {
      isOwnerOfNewsroom: false
    };
  }

  public async componentDidMount(): Promise<void> {
    return this.initGovernmentData();
  }

  public async componentDidUpdate(prevProps: StepProps & SignConstitutionReduxProps, prevState: SignConstitutionState): Promise<void> {
    const prevNewsroomAddress = prevProps.ui.get("newsroomMgmtCurrentAddress");
    const newsroomAddress = this.props.ui.get("newsroomMgmtCurrentAddress");
    const newState: SignConstitutionState = {};

    if (!prevNewsroomAddress && newsroomAddress) {
      const userAccount = this.props.user && this.props.user.account || undefined;
      const newsroom = await getNewsroom(newsroomAddress);
      const isOwner = await newsroom.isOwner(userAccount);
      newState.isOwnerOfNewsroom = isOwner;
    }

    if (Object.keys(newState).length) {
      this.setState(newState);
    }
  }

  public render(): JSX.Element {
    const isSignDisabled = this.isSignBtnDisabled(this.state);
    const helpText = this.btnHelperText(this.state);
    return (<StepStyled index={this.props.index || 0}>
      <Collapsable header={
        <>
          <StepHeader el={this.props.el} isActive={this.props.active === this.props.index}>
            Sign the Civil Constitution
          </StepHeader>
          <p>Agree to the Civil Constitution</p>
        </>
      } open={false}>

        <StyledLegalIframe src={this.props.government.get("constitutionURI")} />

        {helpText}
        <Button onClick={this.signConstitution} disabled={isSignDisabled}>
          Sign Constitution
        </Button>
      </Collapsable>
    </StepStyled>)
  }

  private isSignBtnDisabled = (state: any): boolean => {
    return !this.state.isOwnerOfNewsroom;
  };

  private btnHelperText = (state: any): JSX.Element => {
    if (!this.state.isOwnerOfNewsroom) {
      return (
        <>
          <FormHeading>Your current wallet address is not an owner of this contract</FormHeading>
          <p>Please switch to the wallet associated with this newsroom contract on Metamask.</p>
        </>
      );
    }

    return (
      <>
        <FormHeading>Wallet Connected</FormHeading>
        <p>Signing the Civil Constitution does not incur a gas cost.</p>
      </>
    );
  };

  private initGovernmentData = async (): Promise<void> => {
    const constitutionHash = await getConstitutionHash();
    this.props.dispatch!(addGovernmentData("constitutionHash", constitutionHash));
    const constitutionURI = await getConstitutionUri();
    this.props.dispatch!(addGovernmentData("constitutionURI", constitutionURI));
  };

  private signConstitution = async (event: any): Promise<void> => {
    const signature = await signMessage(this.props.government.get("constitutionHash"));
    console.log(signature);
  };
}

const mapStateToProps = (state: State, ownProps: StepProps): SignConstitutionReduxProps => {
  const { ui, government, user } = state;

  return {
    ui,
    government,
    user,
  };
};

export default connect(mapStateToProps)(SignConstitution);
