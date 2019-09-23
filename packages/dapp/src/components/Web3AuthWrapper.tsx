import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../redux/reducers";
import AuthWeb3Signup from "./Auth/AuthWeb3Signup";
import AuthWeb3Login from "./Auth/AuthWeb3Login";
import SetUsername from "./Auth/SetUsername";
import SetEmail from "./Auth/SetEmail";
import { hideWeb3AuthModal, showWeb3LoginModal, showWeb3SignupModal } from "../redux/actionCreators/ui";
import { ICivilContext, CivilContext } from "@joincivil/components";

export const Web3AuthWrapper: React.FunctionComponent = () => {
  // context
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  const civilUser = civilContext.currentUser;

  // redux
  const dispatch = useDispatch();
  const web3AuthType = useSelector((state: State) => state.web3AuthType);
  const showWeb3AuthModal = useSelector((state: State) => state.showWeb3AuthModal);

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

  async function handleLoginClicked(): Promise<void> {
    dispatch(await showWeb3LoginModal());
  }

  async function handleSignUpClicked(): Promise<void> {
    dispatch(await showWeb3SignupModal());
  }

  async function handleOnOuterClicked(): Promise<void> {
    dispatch(await hideWeb3AuthModal());
  }

  async function handleOnSignupContinue(): Promise<void> {
    dispatch(await hideWeb3AuthModal());
  }

  async function handleOnLoginContinue(): Promise<void> {
    dispatch(await hideWeb3AuthModal());
  }

  async function handleSignUpUserExists(): Promise<void> {
    dispatch(await showWeb3LoginModal());
  }

  async function handleLogInNoUserExists(): Promise<void> {
    dispatch(await showWeb3SignupModal());
  }

  return (
    <>
      {showWeb3Signup && (
        <AuthWeb3Signup
          onSignUpContinue={handleOnSignupContinue}
          onOuterClicked={handleOnOuterClicked}
          onLoginClicked={handleLoginClicked}
          onSignUpUserAlreadyExists={handleSignUpUserExists}
        />
      )}
      {showWeb3Login && (
        <AuthWeb3Login
          onSignUpContinue={handleOnLoginContinue}
          onOuterClicked={handleOnOuterClicked}
          onSignUpClicked={handleSignUpClicked}
          onLogInNoUserExists={handleLogInNoUserExists}
        />
      )}
      {showSetHandle && <SetUsername channelID={channelID} />}
      {showSetEmail && <SetEmail channelID={channelID} />}
    </>
  );
};
