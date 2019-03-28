import * as React from "react";
import * as qs from "querystring";
import styled from "styled-components";
import { BigNumber } from "bignumber.js";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { Parameters, getFormattedTokenBalance } from "@joincivil/utils";
import {
  colors,
  Button,
  buttonSizes,
  OBSectionHeader,
  OBSectionDescription,
  OBNoteText,
  OBCollapsable,
  OBCollapsableHeader,
  OBSmallParagraph,
  OBNoteHeading,
  HollowGreenCheck,
  ClipLoader,
  QuestionToolTip,
} from "@joincivil/components";
import { NextBack, FormTitle, FormSection, FormRow, FormRowItem } from "../styledComponents";

export interface PurchaseTokensExternalProps extends RouteComponentProps {
  navigate(go: 1 | -1): void;
}
export interface PurchaseTokensProps extends PurchaseTokensExternalProps {
  userCvlBalance: BigNumber;
  minDeposit: BigNumber;
  hasMinDeposit: boolean;
}

const BUY_TOKENS_PATH = "/tokens?redirect=%2Fapply-to-registry%3Fpurchased=true";

const Border = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: 28px 0;
`;

const OBSectionSubHeader = styled(OBSectionDescription)`
  color: ${colors.primary.BLACK};
  font-weight: bold;
  text-align: left;
`;

const YouHaveEnough = styled(OBSectionSubHeader)`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: 36px 0 -12px;
  padding-bottom: 36px;
  text-align: center;
`;

const BalanceTip = styled(QuestionToolTip)`
  svg {
    height: 24px;
    width: 24px;
  }
`;
const CvlBalance = styled(FormTitle)`
  color: ${colors.accent.CIVIL_GRAY_0};
  margin-bottom: -4px;
`;
const CvlLabel = styled.span`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 12px;
`;
const BuyCvlTextLink = styled(OBNoteHeading)`
  color: ${colors.accent.CIVIL_BLUE};
  display: block;
  font-weight: bold;
  margin-top: 18px;
`;

const BuyButtonContainer = styled.div`
  display: inline-block;
  margin: 8px 0 36px;
  text-align: center;
`;

export class PurchaseTokensComponent extends React.Component<PurchaseTokensProps> {
  public renderButtons(): JSX.Element | void {
    return <NextBack navigate={this.navigate} nextDisabled={() => !this.props.hasMinDeposit} />;
  }

  public renderNotEnoughTokens(): JSX.Element {
    return (
      <>
        <Border />

        <OBSmallParagraph>
          To buy Civil tokens (CVL), you must buy Ether (ETH) and then you will be able to buy CVL. You can’t use USD or
          local currencies to directly buy a Civil token – currencies need to be converted into ETH first.
        </OBSmallParagraph>

        <OBSectionSubHeader>You can buy Civil tokens (CVL) from our Token Store.</OBSectionSubHeader>
        <OBSmallParagraph>
          To buy tokens, you’ll be purchasing them from our Token store. It uses Airswap, a secure decentralized token
          exchange where you can buy and sell tokens on Ethereum blockchain. Airswap does not charge any fees.
        </OBSmallParagraph>

        <BuyButtonContainer>
          <Button textTransform="none" width={220} size={buttonSizes.MEDIUM_WIDE} to={BUY_TOKENS_PATH}>
            Buy CVL tokens
          </Button>
        </BuyButtonContainer>
      </>
    );
  }

  public renderEnoughTokensOrJustPurchased(): JSX.Element {
    return (
      <>
        <YouHaveEnough>
          {this.props.hasMinDeposit ? (
            <>
              <HollowGreenCheck width={48} height={48} />
              <br />
              You have enough tokens to apply
            </>
          ) : (
            <>
              <ClipLoader size={48} />
              <br />
              You token purchase is processing and your balance will update shortly
            </>
          )}
        </YouHaveEnough>

        <FormSection>
          <FormRow>
            <FormRowItem>
              <OBSectionSubHeader>
                Token Balance
                <BalanceTip explainerText="This is the total amount of Civil tokens availabe in your connected wallet." />
              </OBSectionSubHeader>
            </FormRowItem>
            <FormRowItem>
              <CvlBalance>
                {getFormattedTokenBalance(this.props.userCvlBalance, true)}
                <CvlLabel>CVL</CvlLabel>
              </CvlBalance>
              <OBNoteText>tokens in your wallet</OBNoteText>
              <BuyCvlTextLink>
                <Link to={BUY_TOKENS_PATH}>Buy additional CVL tokens</Link>
              </BuyCvlTextLink>
            </FormRowItem>
          </FormRow>
        </FormSection>
      </>
    );
  }

  public render(): JSX.Element {
    const justPurchased = !!qs.parse(document.location.search.substr(1)).purchased;
    return (
      <>
        <OBSectionHeader>Purchase Tokens to Apply to the Registry</OBSectionHeader>
        <OBSectionDescription>
          You will need {!this.props.hasMinDeposit && "to purchase"}{" "}
          {getFormattedTokenBalance(this.props.minDeposit, true, 0)} Civil tokens (CVL) to deposit with your
          application. These tokens are to state the seriousness of your intent to the Civil community.
        </OBSectionDescription>

        {this.props.hasMinDeposit || justPurchased
          ? this.renderEnoughTokensOrJustPurchased()
          : this.renderNotEnoughTokens()}

        <OBCollapsable
          open={false}
          header={<OBCollapsableHeader>What else will I need to use Civil tokens (CVL) for?</OBCollapsableHeader>}
        >
          <OBSmallParagraph>
            Tokens open up certain activities on the Civil platform including voting on Newsroom applications,
            challenging a Newsroom, or backing another token holder’s Newsroom challenge.
          </OBSmallParagraph>
          <OBSmallParagraph>
            Owning Civil tokens means owning a piece of the Civil network; they will act as voting stakes for the
            platform’s governance (e.g., deciding whether or not a given Newsroom meets the ethical journalism standards
            laid out in the Civil Constitution). There will only ever be a fixed supply of CVL tokens created. Owners of
            CVL will be economically incentivized to ensure existing and future Civil Newsrooms maintain high quality
            standards as the network, and its reach, grows.
          </OBSmallParagraph>
        </OBCollapsable>

        {this.renderButtons()}
      </>
    );
  }

  private navigate = (go: 1 | -1): void => {
    if (qs.parse(document.location.search.substr(1)).purchased) {
      // Remove query string, otherwise they will be forced back to token purchase step if they refresh
      this.props.history.replace({
        pathname: this.props.location.pathname,
      });
    }
    this.props.navigate(go);
  };
}

const mapStateToProps = (state: any, ownProps: PurchaseTokensExternalProps): PurchaseTokensProps => {
  const { user, parameters } = state.networkDependent;
  const userBalance = new BigNumber((user && user.account && user.account.balance) || 0);
  const minDeposit = new BigNumber((parameters && parameters[Parameters.minDeposit]) || 0);
  return {
    ...ownProps,
    userCvlBalance: userBalance,
    minDeposit,
    hasMinDeposit: userBalance.greaterThanOrEqualTo(minDeposit),
  };
};

export const PurchaseTokens = withRouter(connect(mapStateToProps)(PurchaseTokensComponent));
