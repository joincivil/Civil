import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../redux/reducers";
import AuthWeb3Signup from "./Auth/AuthWeb3Signup";
import AuthWeb3Login from "./Auth/AuthWeb3Login";
import SetUsername from "./Auth/SetUsername";
import SetEmail from "./Auth/SetEmail";
import { hideWeb3AuthModal, showWeb3LoginModal, showWeb3SignupModal } from "../redux/actionCreators/ui";

interface Web3AuthWrapperProps {
  showWeb3AuthModal: boolean;
  web3AuthType: string;
}

interface Web3AuthWrapperOwnProps {
  civilUser: any;
}

class Web3AuthWrapperComponent extends React.Component<
  Web3AuthWrapperProps & DispatchProp<any> & Web3AuthWrapperOwnProps
> {
  public render(): JSX.Element {
    const civilUser = this.props.civilUser;
    const { showWeb3AuthModal, web3AuthType } = this.props;

    const showWeb3Signup = showWeb3AuthModal && web3AuthType === "signup";
    const showWeb3Login = showWeb3AuthModal && web3AuthType === "login";
    let showSetHandle = false;
    let showSetEmail = false;
    if (civilUser && civilUser.uid && civilUser.userChannel) {
      showSetHandle = !civilUser.userChannel.handle;
      if (!showSetHandle) {
        showSetEmail = !civilUser.userChannelEmailPromptSeen;
      }
    }

    let channelID;
    if (showSetHandle || showSetEmail) {
      channelID = civilUser.userChannel.id;
    }

    return (
      <>
        {showWeb3Signup && (
          <AuthWeb3Signup
            onSignupContinue={this.handleOnSignupContinue}
            onOuterClicked={this.handleOnOuterClicked}
            onLoginClicked={this.handleLoginClicked}
          />
        )}
        {showWeb3Login && (
          <AuthWeb3Login
            onSignupContinue={this.handleOnLoginContinue}
            onOuterClicked={this.handleOnOuterClicked}
            onSignUpClicked={this.handleSignUpClicked}
          />
        )}
        {showSetHandle && <SetUsername channelID={channelID} />}
        {showSetEmail && <SetEmail channelID={channelID} />}
      </>
    );
  }

  public handleLoginClicked = async () => {
    this.props.dispatch!(await showWeb3LoginModal());
  };

  public handleSignUpClicked = async () => {
    console.log("handleSignUpClicked");
    this.props.dispatch!(await showWeb3SignupModal());
  };

  public handleOnOuterClicked = async () => {
    this.props.dispatch!(await hideWeb3AuthModal());
  };

  public handleOnSignupContinue = async () => {
    this.props.dispatch!(await hideWeb3AuthModal());
  };

  public handleOnLoginContinue = async () => {
    this.props.dispatch!(await hideWeb3AuthModal());
  };
}

const mapStateToProps = (state: State, ownProps: Web3AuthWrapperOwnProps): Web3AuthWrapperProps => {
  const { showWeb3AuthModal, web3AuthType } = state;

  return {
    showWeb3AuthModal,
    web3AuthType,
    ...ownProps,
  };
};

export const Web3AuthWrapper = connect(mapStateToProps)(Web3AuthWrapperComponent);
