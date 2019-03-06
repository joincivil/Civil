import * as React from "react";
import * as qs from "querystring";
import styled from "styled-components";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import {
  AccountEmailSent,
  AccountEmailAuth,
  AccountVerifyToken,
  AuthApplicationEnum,
  AuthPageFooterLink,
  OBSectionTitle,
  OBSectionDescription,
  PageHeadingTextCentered,
  PageSubHeadingCentered,
  OBPreRegNotice,
} from "@joincivil/components";
import { isLoggedIn } from "@joincivil/utils";

export interface AuthWrapperState {
  loading: boolean;
  loggedIn: boolean;
  magicEmailSent?: string;
  showTokenVerified?: boolean;
}

export interface AuthParams {
  action?: "login" | "signup";
}

const BASE_PATH = "/apply-to-registry";
const PreRegNotice = styled(OBPreRegNotice)`
  margin-left: -20%;
  margin-top: 0;
  width: 140%;
`;

const Wrapper = styled.div`
  margin: 70px auto 0 auto;
  max-width: 700px;
`;
const SignupLoginInnerWrap = styled.div`
  margin: 0 auto;
  max-width: 520px;
`;

const BodyText = styled(PageHeadingTextCentered)`
  margin-bottom: 12px;
`;

const FooterLink = styled(AuthPageFooterLink)`
  font-size: 13px;
`;

const Footer: React.SFC = () => (
  <></>
  // @TODO/toby Re-enable footer when foundation launches this page
  // <AuthFooterTerms
  //   textEl={
  //     <BodyText>
  //       By joining Civil, you will become part of a community of high quality news publishers. Your content will be
  //       featured alongside other Civil newsroom and enjoy all the privileges of the Civil community.
  //     </BodyText>
  //   }
  //   benefitsUrl={"https://civil.co/how-to-launch-newsroom/"}
  // />
);

class AuthWrapperComponent extends React.Component<RouteComponentProps<AuthParams>, AuthWrapperState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      loading: true,
      loggedIn: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    this.setState(
      {
        loggedIn: await isLoggedIn(),
      },
      () => {
        this.setState({
          loading: false,
        });
      },
    );
  }

  public render(): JSX.Element {
    if (this.state.loggedIn) {
      return <>{this.props.children}</>;
    }

    if (this.state.loading) {
      return <>Loading...</>;
    }

    const token = qs.parse(this.props.location.search.substr(1)).jwt as string;
    const isNewUser = this.props.match.params.action !== "login";

    if (token || this.state.showTokenVerified) {
      return (
        <Wrapper>
          <AccountVerifyToken
            isNewUser={isNewUser}
            token={token!}
            onAuthenticationContinue={this.onAuthenticationContinue}
            ethAuthNextExt={isNewUser}
          />
        </Wrapper>
      );
    }

    if (this.state.magicEmailSent) {
      return (
        <Wrapper>
          <OBSectionTitle>Add your Newsroom to Civil</OBSectionTitle>
          <AccountEmailSent
            isNewUser={isNewUser}
            emailAddress={this.state.magicEmailSent}
            onSendAgain={this.sendAgain}
          />
          {isNewUser && <Footer />}
        </Wrapper>
      );
    }

    return this.renderSignupLogin(isNewUser);
  }

  private renderSignupLogin(isNewUser: boolean): JSX.Element {
    return (
      <Wrapper>
        <SignupLoginInnerWrap>
          <OBSectionTitle>Add your Newsroom to Civil</OBSectionTitle>
          <OBSectionDescription>
            Create an account to add your newsroom to Civil. First, please enter your email address. Your email is used
            to send account-related updates from Civil.
          </OBSectionDescription>

          <PreRegNotice />

          {isNewUser ? (
            <PageSubHeadingCentered>Let's get started</PageSubHeadingCentered>
          ) : (
            <>
              <PageSubHeadingCentered style={{ marginBottom: -4 }}>Sign in with email</PageSubHeadingCentered>
              <BodyText>
                Enter the email address associated with your account and we'll send a login link to your inbox.
              </BodyText>
            </>
          )}

          <AccountEmailAuth
            applicationType={AuthApplicationEnum.NEWSROOM}
            isNewUser={isNewUser}
            onEmailSend={this.onEmailSend}
            loginPath={`${BASE_PATH}/login`}
            signupPath={`${BASE_PATH}/signup`}
          />

          <FooterLink>
            {isNewUser ? (
              <Link to={`${BASE_PATH}/login`}>Already have an account?</Link>
            ) : (
              <Link to={`${BASE_PATH}/signup`}>← Back to create an account</Link>
            )}
          </FooterLink>
        </SignupLoginInnerWrap>

        {isNewUser && <Footer />}
      </Wrapper>
    );
  }

  private onEmailSend = (isNewUser: boolean, emailAddress: string): void => {
    this.setState({
      magicEmailSent: emailAddress,
    });
  };

  private onAuthenticationContinue = (isNewUser: boolean) => {
    // Remove e.g. /signup?jwt=[token] from path
    this.props.history.replace({
      pathname: BASE_PATH,
    });

    // @TODO/tobek Once token verification is handled better (flushing apollo cache so that client uses auth header) we can jump straight to "logged in" state. For now we have to refresh, and on refresh we'll be in the logged in state.
    this.setState({ showTokenVerified: true }); // prevent flash before reload
    window.location.reload();
  };

  private sendAgain = () => {
    this.setState({
      magicEmailSent: undefined,
    });
  };
}

// Have to declare AuthWrapper type here, can't find any other way to get around "Exported variable 'AuthWrapper' is using name 'StaticContext' from external module" error. Importing `StaticContext` from `react-router` isn't fixing it.
export const AuthWrapper: React.ComponentClass<Pick<RouteComponentProps<AuthParams>, never>> = withRouter(
  AuthWrapperComponent,
);
