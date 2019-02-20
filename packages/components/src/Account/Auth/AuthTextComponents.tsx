import * as React from "react";
import { PageHeadingTextCenteredSmall, PageHeadingTextCentered } from "../../Heading";

export const AuthTextFooter: React.SFC = () => (
  <PageHeadingTextCenteredSmall>
    By joining Civil, you will become part of a community of high quality news publishers. Your content will be featured
    alongside other Civil newsroom and enjoy all the privileges of the Civil community.
  </PageHeadingTextCenteredSmall>
);

export const AuthTextEmailSent: React.SFC<{
  emailAddress: string;
}> = ({ emailAddress }) => (
  <PageHeadingTextCentered>
    We sent you an email to <strong>{emailAddress}</strong> that includes a link to confirm your email address. It
    expires soon, so please check your email and click on the link. Once confimed, you can continue.
  </PageHeadingTextCentered>
);
