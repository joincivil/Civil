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

const Footer: React.FunctionComponent = () => (
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

    return this.renderSignupLogin();
  }

  private renderSignupLogin(): JSX.Element {
    return (
      <Wrapper>
        <SignupLoginInnerWrap>
          <OBSectionTitle>Add your Newsroom to Civil</OBSectionTitle>
          <OBSectionDescription>
            Sign Up or Login to add your Newsroom to Civil.
          </OBSectionDescription>
        </SignupLoginInnerWrap>
      </Wrapper>
    );
  }
}

// Have to declare AuthWrapper type here, can't find any other way to get around "Exported variable 'AuthWrapper' is using name 'StaticContext' from external module" error. Importing `StaticContext` from `react-router` isn't fixing it.
export const AuthWrapper: React.ComponentClass<Pick<RouteComponentProps<AuthParams>, never>> = withRouter(
  AuthWrapperComponent,
);
