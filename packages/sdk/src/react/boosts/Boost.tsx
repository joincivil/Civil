import * as React from "react";
import { Query } from "react-apollo";
import { withRouter, RouteComponentProps } from "react-router";
import styled from "styled-components";
import { boostQuery, boostNewsroomQuery } from "./queries";
import { BoostData, BoostNewsroomData } from "./types";
import { BoostCard } from "./BoostCard";
import { BoostForm } from "./BoostForm";
import { BoostPayments } from "./payments/BoostPayments";
import { BoostWrapper } from "./BoostStyledComponents";
import { NewsroomWithdraw } from "../NewsroomWithdraw";
import { BoostEmbedNoScroll } from "./BoostEmbedNoScroll";
import { withBoostPermissions, BoostPermissionsInjectedProps } from "./BoostPermissionsHOC";
import {
  LoadingMessage,
  CivilContext,
  ICivilContext,
  colors,
  mediaQueries,
  RENDER_CONTEXT,
} from "@joincivil/components";

const WithdrawWrapper = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 0 0 16px;
  margin: 36px 0;

  ${mediaQueries.MOBILE} {
    margin: 18px 0;
  }
`;

export interface BoostExternalProps {
  boostId: string;
  open: boolean;
  disableOwnerCheck?: boolean;
  disableHelmet?: boolean;
  editMode?: boolean;
  payment?: boolean;
}

export type BoostProps = BoostExternalProps & BoostPermissionsInjectedProps & RouteComponentProps;

export interface BoostStates {
  paymentSuccess: boolean;
}

class BoostComponent extends React.Component<BoostProps, BoostStates> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  public constructor(props: BoostProps) {
    super(props);
    this.state = {
      paymentSuccess: false,
    };
  }

  public componentDidMount(): void {
    const { history } = this.props;
    if (history && history.location && history.location.state && history.location.state.paymentSuccess) {
      this.setState({ paymentSuccess: history.location.state.paymentSuccess });
    }
  }

  public render(): JSX.Element {
    const id = this.props.boostId;

    return (
      <Query query={boostQuery} variables={{ id }}>
        {({ loading, error, data, refetch }) => {
          if (loading) {
            return (
              <BoostWrapper open={this.props.open}>
                <LoadingMessage>Loading Boost</LoadingMessage>
              </BoostWrapper>
            );
          } else if (error) {
            console.error("error loading boost data. error:", error, "data:", data);
            return (
              <BoostWrapper open={this.props.open}>
                Error loading Boost: {error ? JSON.stringify(error) : "No Boost data found"}
              </BoostWrapper>
            );
          }

          if (this.state.paymentSuccess) {
            void refetch();
          }

          const boostData = data.postsGet as BoostData;
          const newsroomContractAddress = boostData.channel.newsroom.contractAddress;

          // Set up boost permissions checks HOC:
          this.props.setNewsroomContractAddress(newsroomContractAddress);

          return (
            <Query query={boostNewsroomQuery} variables={{ addr: newsroomContractAddress }}>
              {({ loading: newsroomQueryLoading, error: newsroomQueryError, data: newsroomQueryData }) => {
                if (newsroomQueryLoading) {
                  return (
                    <BoostWrapper open={this.props.open}>
                      <LoadingMessage>Loading Newsroom</LoadingMessage>
                    </BoostWrapper>
                  );
                } else if (newsroomQueryError || !newsroomQueryData || !newsroomQueryData.listing) {
                  console.error("error loading newsroom data. error:", newsroomQueryError, "data:", newsroomQueryData);
                  return (
                    <BoostWrapper open={this.props.open}>
                      Error loading Boost newsroom data:{" "}
                      {newsroomQueryError
                        ? JSON.stringify(newsroomQueryError)
                        : `No newsroom listing found at ${newsroomContractAddress}`}
                    </BoostWrapper>
                  );
                }
                const newsroomData = newsroomQueryData.listing as BoostNewsroomData;

                if (this.props.editMode) {
                  return this.renderEditMode(boostData, newsroomData);
                }

                if (this.props.payment) {
                  return (
                    <BoostPayments
                      boostId={id}
                      title={boostData.title}
                      newsroomName={newsroomData.name}
                      paymentAddr={newsroomData.owner}
                      handleBackToListing={this.handleBackToListing}
                      handlePaymentSuccess={this.handlePaymentSuccess}
                      isStripeConnected={boostData.channel.isStripeConnected}
                      stripeAccountID={boostData.channel.stripeAccountID}
                      history={this.props.history}
                    />
                  );
                }

                return (
                  <>
                    {this.props.open && this.context.renderContext === RENDER_CONTEXT.EMBED && (
                      <BoostEmbedNoScroll boostId={id} />
                    )}

                    {/*@TODO/tobek Move to Newsroom Boosts page when we have that.*/}
                    {this.props.open && this.props.newsroom && this.props.boostOwner && (
                      <WithdrawWrapper>
                        <NewsroomWithdraw
                          newsroomAddress={boostData.channel.newsroom.contractAddress}
                          newsroom={this.props.newsroom}
                          isStripeConnected={boostData.channel.isStripeConnected}
                        />
                      </WithdrawWrapper>
                    )}
                    <BoostCard
                      boostData={boostData}
                      newsroomData={newsroomData}
                      boostOwner={this.props.boostOwner}
                      open={this.props.open}
                      boostId={id}
                      disableHelmet={this.props.disableHelmet}
                      handlePayments={this.startPayment}
                      paymentSuccess={this.state.paymentSuccess}
                    />
                  </>
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  }

  private renderEditMode(boostData: BoostData, newsroomData: BoostNewsroomData): JSX.Element {
    const listingUrl = `${document.location.origin}/listing/${boostData.channel.newsroom.contractAddress}`;
    return (
      <BoostForm
        channelID={boostData.channel.id}
        editMode={true}
        boostId={this.props.boostId}
        initialBoostData={boostData}
        newsroomData={newsroomData}
        newsroomContractAddress={boostData.channel.newsroom.contractAddress}
        newsroomListingUrl={listingUrl}
      />
    );
  }

  private startPayment = (usdToSpend: number) => {
    this.props.history.push({
      // Current pathname shouldn't have trailing slash, but could happen if someone copied the payment route and deleted "payment" instead of "/payment", as I keep doing when testing, so, get rid of it
      pathname: this.props.location.pathname.replace(/\/$/, "") + "/payment",
      state: { usdToSpend },
    });
    this.context.fireAnalyticsEvent("boosts", "start support", this.props.boostId, usdToSpend);
  };

  private handlePaymentSuccess = () => {
    this.props.history.push({
      pathname: this.props.location.pathname.replace("/payment", ""),
      state: { paymentSuccess: true },
    });
  };

  private handleBackToListing = () => {
    this.props.history.push(this.props.location.pathname.replace("/payment", ""));
  };
}

// @WORKAROUND/tobek In order to avoid spurious "Function components do not support contextType" runtime error when using the component output by `withRouter` HOC as input into a HOC that uses context, you need to wrap it in a dummy component (https://github.com/facebook/react/issues/14061). Ideally we could use a generalizable `withRouterWorkaround` (https://github.com/facebook/react/issues/14061#issuecomment-471959332) instead of declaring the dummy component here, but that crashes typescript because of a typescript bug (https://github.com/microsoft/TypeScript/issues/33133).
const WrappedBoostWorkaround = (props: BoostProps) => <BoostComponent {...props} />;
export const Boost = withBoostPermissions(withRouter(WrappedBoostWorkaround));
