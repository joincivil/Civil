import * as React from "react";
import {
  PageHeadingTextCenteredSmall,
  PageHeadingTextCentered,
  PageSubHeadingCentered,
  PageHeadingCentered,
  PageHeadingTextCenteredLarge,
} from "../../Heading";

export const AuthTextFooter: React.SFC = () => (
  // TODO(jorgelo): For the store front, the text should be:

  <PageHeadingTextCenteredSmall>
    By joining Civil, you will become part of the Civil community supporting and building the future of news. As a
    member, you'll get a direct say in running the Civil platform, connect with journalists and fund great journalism
    projects. Read more about those benefits
  </PageHeadingTextCenteredSmall>
);

export const AuthTextEmailSent: React.SFC<{
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

export const AuthTextVerifyTokenConfirmed: React.SFC = () => (
  <>
    <PageSubHeadingCentered>Email Address Confirmed!</PageSubHeadingCentered>
    <PageHeadingTextCenteredLarge>Thanks for confirming your email address.</PageHeadingTextCenteredLarge>
  </>
);

export const AuthTextVerifyTokenVerifying: React.SFC = () => (
  <>
    <PageSubHeadingCentered>Confirming your email address...</PageSubHeadingCentered>
  </>
);

export const AuthTextEthAuthNext: React.SFC = () => (
  <>
    <PageHeadingTextCenteredLarge>Next, we'll set up your secure crypto wallet.</PageHeadingTextCenteredLarge>
  </>
);

// TODO(jorgelo): Jorge made this up, it should probably be nicer.
export const AuthTextVerifyTokenError: React.SFC<{ errorMessage: string }> = ({ errorMessage }) => (
  <>
    <PageSubHeadingCentered>Uh oh.</PageSubHeadingCentered>
    <PageHeadingTextCenteredLarge>
      There was a problem verifying your email: <strong>{errorMessage}</strong>
    </PageHeadingTextCenteredLarge>
  </>
);

export const AuthTextCreateAccount: React.SFC = () => (
  <>
    <PageHeadingCentered>Create your Civil account</PageHeadingCentered>
    <PageHeadingTextCentered>
      First, please enter your email address. Your email is used to send account related updates from Civil.
    </PageHeadingTextCentered>
    <PageSubHeadingCentered>Let's get started</PageSubHeadingCentered>
  </>
);

export const AuthTextCheckSpam: React.SFC = () => (
  <PageHeadingTextCenteredLarge>Please check your spam folder if you don’t see the email.</PageHeadingTextCenteredLarge>
);

export const AuthTextSigninWithEmail: React.SFC = () => (
  <>
    <PageHeadingCentered>Sign in with email</PageHeadingCentered>
    <PageHeadingTextCentered>
      Enter the address associated with your account, and we'll send a magic link to your inbox.
    </PageHeadingTextCentered>
  </>
);
