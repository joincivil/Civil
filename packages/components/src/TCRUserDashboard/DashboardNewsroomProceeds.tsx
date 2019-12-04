import * as React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import { LoadingIndicator } from "../LoadingIndicator";
import { withNewsroomChannel, NewsroomChannelInjectedProps } from "../WithNewsroomChannelHOC";
import { colors, fonts, mediaQueries } from "@joincivil/elements";
import gql from "graphql-tag";

const boostTypeProceedsQuery = gql`
  query proceeds($channelID: String!, $boostType: String!) {
    getChannelTotalProceedsByBoostType(channelID: $channelID, boostType: $boostType) {
      totalAmount
      usd
      ethUsdAmount
      ether
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin: 0 0 20px;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

const Proceed = styled.div`
  flex: 1;
  padding: 15px;
`;

const TotalProceeds = styled(Proceed)`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
`;

const Amount = styled.span`
  color: ${colors.primary.BLACK};
  font-size: 16px;
`;

const TotalAmount = styled(Amount)`
  font-size: 20px;
`;

interface CurrencyLabelProps {
  secondary?: boolean;
}
const CurrencyLabel = styled.span`
  color: ${colors.primary.CIVIL_GRAY_0};
  font-size: 12px;
  font-weight: ${(props: CurrencyLabelProps) => (props.secondary ? 500 : 600)};
`;

export interface NewsroomProceedsProps {
  newsroomAddress: string;
  boostType: string;
}

class NewsroomProceedsComponent extends React.Component<NewsroomProceedsProps & NewsroomChannelInjectedProps> {
  public constructor(props: NewsroomProceedsProps & NewsroomChannelInjectedProps) {
    super(props);
  }
  public render(): JSX.Element {
    return (
      <Query<any>
        query={boostTypeProceedsQuery}
        variables={{ channelID: this.props.channelData.id, boostType: this.props.boostType }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <LoadingIndicator />;
          } else if (error || !data || !data.getChannelTotalProceedsByBoostType) {
            console.error("Error loading boost proceeds query:", error || "no data returned");
            return <span>Error loading proceed amounts: {JSON.stringify(error || "no data returned")}</span>;
          }

          let { totalAmount, ether, ethUsdAmount, usd } = data.getChannelTotalProceedsByBoostType;
          totalAmount = parseFloat(totalAmount || 0).toFixed(2);
          ether = parseFloat(ether || 0).toFixed(5);
          ethUsdAmount = parseFloat(ethUsdAmount || 0).toFixed(2);
          usd = parseFloat(usd || 0).toFixed(2);

          return (
            <Wrapper>
              <TotalProceeds>
                <div>
                  <TotalAmount>${totalAmount}</TotalAmount> <CurrencyLabel>USD</CurrencyLabel>
                </div>
                <div>Total Collected</div>
              </TotalProceeds>
              <Proceed>
                <div>
                  <Amount>{ether}</Amount> <CurrencyLabel>ETH</CurrencyLabel> ≈ ${ethUsdAmount}{" "}
                  <CurrencyLabel secondary={true}>USD</CurrencyLabel>
                </div>
                <div>ETH Proceeds</div>
              </Proceed>
              <Proceed>
                <div>
                  <Amount>${usd}</Amount> <CurrencyLabel secondary={true}>USD</CurrencyLabel>
                </div>
                <div>Credit Card Proceeds</div>
              </Proceed>
            </Wrapper>
          );
        }}
      </Query>
    );
  }
}

export const NewsroomProceeds: React.ComponentType<NewsroomProceedsProps> = withNewsroomChannel(
  NewsroomProceedsComponent,
) as any;
