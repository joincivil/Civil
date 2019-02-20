import * as React from "react";
import {
  PageHeadingTextCenteredSmall,
  PageHeadingTextCentered,
  PageSubHeadingCentered,
  PageHeadingCentered,
} from "../../Heading";

export const AuthTextFooter: React.SFC = () => (
  <PageHeadingTextCenteredSmall>
    By joining Civil, you will become part of a community of high quality news publishers. Your content will be featured
    alongside other Civil newsroom and enjoy all the privileges of the Civil community.
  </PageHeadingTextCenteredSmall>
);

export const AuthTextEmailSent: React.SFC<{
  emailAddress: string;
}> = ({ emailAddress }) => (
  <>
    <PageSubHeadingCentered>Check your email!</PageSubHeadingCentered>
    <PageHeadingTextCentered>
      We sent you an email to <strong>{emailAddress}</strong> that includes a link to confirm your email address. It
      expires soon, so please check your email and click on the link. Once confimed, you can continue.
    </PageHeadingTextCentered>
  </>
);

export const AuthTextVerifyTokenConfirmed: React.SFC = () => (
  <>
    <PageSubHeadingCentered>Email Address Confirmed!</PageSubHeadingCentered>
    <PageHeadingTextCentered>Thanks for confirming your email address</PageHeadingTextCentered>
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
  <PageHeadingTextCentered>Please check your spam folder if you don’t see the email.</PageHeadingTextCentered>
);

export const AuthTextSigninWithEmail: React.SFC = () => (
  <>
    <PageHeadingCentered>Sign in with email</PageHeadingCentered>
    <PageHeadingTextCentered>
      Enter the address associated with your account, and we'll send a magic link to your inbox.
    </PageHeadingTextCentered>
  </>
);
