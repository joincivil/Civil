import * as React from "react";
import { connect, DispatchProp } from "react-redux";
// import { addGovernmentData } from "./actionCreators";
// import { getConstitutionHash, getConstitutionUri, getNewsroom, signMessage } from "../../apis/civilTCR";
import {
  StepHeader,
  StepProps,
  StepStyled,
  Collapsable,
  // SignConstitutionButton,
  StepDescription,
} from "@joincivil/components";
// import styled from "styled-components";
import { Map } from "immutable";
// import { getCivil } from "../../helpers/civilInstance";

// const StyledLegalIframe = styled.iframe`
// border-width: 1px;
// height: 15rem;
// margin: 0 0 2rem;
// width: 100%;
// `;

export interface SignConstitutionProps {
  address?: string;
}

export interface SignConstitutionReduxProps {
  government?: Map<string, string>;
  user?: any;
}

export interface SignConstitutionState {
  isNewsroomOwner?: boolean;
}

class SignConstitutionComponent extends React.Component<
  DispatchProp<any> & StepProps & SignConstitutionProps & SignConstitutionReduxProps,
  SignConstitutionState
> {
  constructor(props: StepProps & SignConstitutionProps & SignConstitutionReduxProps) {
    super(props);
    this.state = {
      isNewsroomOwner: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    if (this.props.address && this.props.address.length && !this.props.disabled) {
      // const isOwner = await this.isNewsroomOwner();
      // this.setState({ isNewsroomOwner: isOwner });
    }
    // return this.initGovernmentData();
  }

  public async componentDidUpdate(
    prevProps: StepProps & SignConstitutionProps & SignConstitutionReduxProps,
    prevState: SignConstitutionState,
  ): Promise<void> {
    // const prevNewsroomAddress = prevProps.address;
    // const newsroomAddress = this.props.address;
    // const newState: SignConstitutionState = {};
    // const isUpdatedAddress = !prevNewsroomAddress && newsroomAddress && newsroomAddress.length;
    // const isUpdatedUser = prevProps.user !== this.props.user;
    // if (isUpdatedAddress || (isUpdatedUser && !this.props.disabled)) {
    // const isOwner = await this.isNewsroomOwner();
    // newState.isNewsroomOwner = isOwner;
    // }
    // if (Object.keys(newState).length) {
    // this.setState(newState);
    // }
  }

  public render(): JSX.Element {
    // const civil = getCivil();
    return (
      <StepStyled disabled={this.props.disabled} index={this.props.index || 0}>
        <Collapsable
          header={
            <>
              <StepHeader disabled={this.props.disabled}>Sign the Civil Constitution (Coming Soon!)</StepHeader>
              <StepDescription disabled={this.props.disabled}>Agree to the Civil Constitution</StepDescription>
            </>
          }
          disabled={this.props.disabled}
          open={false}
        >
          {/* <StyledLegalIframe src={this.props.government!.get("constitutionURI")} /> */}

          {/* <SignConstitutionButton */}
          {/* civil={civil} */}
          {/* requiredNetwork="rinkeby" */}
          {/* isNewsroomOwner={this.state.isNewsroomOwner} */}
          {/* signConstitution={this.signConstitution} */}
          {/* > */}
          {/* Create Newsroom */}
          {/* </SignConstitutionButton> */}
        </Collapsable>
      </StepStyled>
    );
  }

  // private initGovernmentData = async (): Promise<void> => {
  // const constitutionHash = await getConstitutionHash();
  // this.props.dispatch!(addGovernmentData("constitutionHash", constitutionHash));
  // const constitutionURI = await getConstitutionUri();
  // this.props.dispatch!(addGovernmentData("constitutionURI", constitutionURI));
  // };

  // private signConstitution = async (): Promise<void> => {
  // const signature = await signMessage(this.props.government!.get("constitutionHash"));
  // console.log(signature);
  // };

  // private isNewsroomOwner = async (): Promise<boolean> => {
  // const userAccount = (this.props.user && this.props.user.account) || undefined;
  // if (!userAccount || Object.keys(userAccount).length === 0) {
  // return false;
  // }
  // const newsroom = await getNewsroom(this.props.address!);
  // const isOwner = await newsroom.isOwner(userAccount.account);
  // return isOwner;
  // };
}

const mapStateToProps = (
  state: any,
  ownProps: StepProps & SignConstitutionReduxProps,
): StepProps & SignConstitutionReduxProps & SignConstitutionReduxProps => {
  // const { government, user } = state;

  return {
    // ...ownProps,
    // government,
    // user,
  };
};

export const SignConstitution = connect(mapStateToProps)(SignConstitutionComponent);
