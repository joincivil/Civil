import * as React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import {
  LoadingIndicator,
  colors,
  fonts,
  mediaQueries,
  withNewsroomChannel,
  NewsroomChannelInjectedProps,
} from "@joincivil/components";
import { boostProceedsQuery } from "./queries";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 32px 0;
  font-size: 14px;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;
const Proceed = styled.div`
  padding: 20px;
  flex: 1;
`;
const TotalProceeds = styled(Proceed)`
  font-family: ${fonts.SANS_SERIF};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
`;

const Amount = styled.span`
  color: ${colors.primary.BLACK};
  font-size: 16px;
`;
const TotalAmount = styled(Amount)`
  font-size: 20px;
`;
const CurrencyLabel = styled.span`
  color: ${colors.primary.CIVIL_GRAY_0};
  font-size: 12px;
  font-weight: bold;
`;

export interface BoostProceedsProps {
  newsroomAddress: string;
}

class BoostProceedsComponent extends React.Component<BoostProceedsProps & NewsroomChannelInjectedProps> {
  public constructor(props: BoostProceedsProps & NewsroomChannelInjectedProps) {
    super(props);
  }
  public render(): JSX.Element {
    return (
      <Query query={boostProceedsQuery} variables={{ channelID: this.props.channelData.id }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <LoadingIndicator />;
          } else if (error || !data || !data.getChannelTotalProceeds) {
            console.error("Error loading boost proceeds query:", error || "no data returned");
            return (
              <span style={{ color: "red" }}>
                Error loading Boost proceed amounts: {JSON.stringify(error || "no data returned")}
              </span>
            );
          }

          let { totalAmount, ether, ethUsdAmount, usd } = data.getChannelTotalProceeds;
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
                <div>Total Proceeds from Boosts</div>
              </TotalProceeds>
              <Proceed>
                <div>
                  <Amount>{ether}</Amount> <CurrencyLabel>ETH</CurrencyLabel> ~= ${ethUsdAmount}{" "}
                  <CurrencyLabel>USD</CurrencyLabel>
                </div>
                <div>ETH Proceeds</div>
              </Proceed>
              <Proceed>
                <div>
                  <Amount>${usd}</Amount> <CurrencyLabel>USD</CurrencyLabel>
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

export const BoostProceeds: React.ComponentType<BoostProceedsProps> = withNewsroomChannel(
  BoostProceedsComponent,
) as any;
