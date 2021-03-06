import * as React from "react";
import {
  PageHeadingTextCenteredSmall,
  PageHeadingTextCentered,
  PageSubHeadingCentered,
  PageHeadingCentered,
  PageHeadingTextCenteredLarge,
  PageHeadingLeftAligned,
  PageHeadingTextLeftAligned,
} from "../../Heading";
import { Link } from "react-router-dom";

export const AuthTextFooter: React.FunctionComponent = () => (
  // TODO(jorgelo): For the store front, the text should be:

  <PageHeadingTextCenteredSmall>
    By joining Civil, you will get a direct say in running the Civil platform, connect with journalists and fund great
    journalism projects.
  </PageHeadingTextCenteredSmall>
);

export const AuthTextEmailSent: React.FunctionComponent<{
  emailAddress: string;
}> = ({ emailAddress }) => (
  <>
    <PageSubHeadingCentered>Check your email!</PageSubHeadingCentered>
    <PageHeadingTextCenteredLarge>
      We sent you an email to <strong>{emailAddress}</strong> that includes a link to confirm your email address. It
      expires soon, so please check your email and click on the link. Once confimed, you can continue.
    </PageHeadingTextCenteredLarge>
  </>
);

export const AuthTextVerifyTokenConfirmed: React.FunctionComponent = () => (
  <>
    <PageSubHeadingCentered>Email Address Confirmed!</PageSubHeadingCentered>
    <PageHeadingTextCenteredLarge>Thanks for confirming your email address.</PageHeadingTextCenteredLarge>
  </>
);

export const AuthTextVerifyTokenVerifying: React.FunctionComponent = () => (
  <>
    <PageSubHeadingCentered>Confirming your email address...</PageSubHeadingCentered>
  </>
);

export const AuthTextEthAuthNext: React.FunctionComponent = () => (
  <>
    <PageHeadingTextCenteredLarge>Next, we'll set up your secure crypto wallet.</PageHeadingTextCenteredLarge>
  </>
);

// TODO(jorgelo): Jorge made this up, it should probably be nicer.
export const AuthTextVerifyTokenError: React.FunctionComponent<{ errorMessage: string }> = ({ errorMessage }) => (
  <>
    <PageSubHeadingCentered>Uh oh.</PageSubHeadingCentered>
    <PageHeadingTextCenteredLarge>
      <strong>{errorMessage}</strong>
    </PageHeadingTextCenteredLarge>
  </>
);

export const AuthTextCreateAccount: React.FunctionComponent = () => (
  <>
    <PageHeadingCentered>Create your Civil account</PageHeadingCentered>
    <PageHeadingTextCentered>
      First, please enter your email address. Your email is used to send account related updates from Civil.
    </PageHeadingTextCentered>
    <PageSubHeadingCentered>Let's get started</PageSubHeadingCentered>
  </>
);

export const AuthTextCheckSpam: React.FunctionComponent = () => (
  <PageHeadingTextCenteredLarge>Please check your spam folder if you don’t see the email.</PageHeadingTextCenteredLarge>
);

export const AuthTextSigninWithEmail: React.FunctionComponent = () => (
  <>
    <PageHeadingCentered>Sign in with email</PageHeadingCentered>
    <PageHeadingTextCentered>
      Enter the address associated with your account, and we'll send a magic link to your inbox.
    </PageHeadingTextCentered>
  </>
);

export const AuthTextSetHandle: React.FunctionComponent = () => (
  <>
    <PageHeadingCentered>Welcome to the Civil community</PageHeadingCentered>
    <PageHeadingTextCentered>
      To help the Civil community identify you, please enter a username.
    </PageHeadingTextCentered>
  </>
);

export const AuthTextSetAvatar: React.FunctionComponent = () => (
  <>
    <PageHeadingLeftAligned>Add profile photo</PageHeadingLeftAligned>
    <PageHeadingTextLeftAligned>
      To help the Civil community identify you, add a profile image.
    </PageHeadingTextLeftAligned>
  </>
);

export const AuthTextEmailNotFoundError: React.FunctionComponent<{ signupPath: string }> = ({ signupPath }) => (
  <>
    The email address you entered does not exist. Try again? or{" "}
    <Link to={signupPath}>create a Civil account to continue.</Link>
  </>
);

export const AuthTextEmailExistsError: React.FunctionComponent<{ loginPath: string }> = ({ loginPath }) => (
  <>
    Your account already exists. <Link to={loginPath}>Login to continue.</Link>
  </>
);

// TODO(jorgelo): Make this text nicer.
export const AuthTextUnknownError: React.FunctionComponent = () => (
  <>An internal error has occured, please try again.</>
);
