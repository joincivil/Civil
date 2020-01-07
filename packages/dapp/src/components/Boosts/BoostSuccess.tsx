import * as React from "react";
import { Link } from "react-router-dom";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import gql from "graphql-tag";
import { Helmet } from "react-helmet";
import { Query } from "react-apollo";
import { LoadingMessage } from "@joincivil/components";
import { BoostSuccess, BoostSuccessWrap } from "./BoostSuccessComponent";

export const boostDataQuery = gql`
  query Boost($id: String!) {
    postsGet(id: $id) {
      id
      ... on PostBoost {
        channel {
          id
          isStripeConnected
          newsroom {
            name
            multisigAddress
          }
        }
        title
      }
    }
  }
`;

export interface BoostPageProps {
  match: any;
}

class BoostSuccessPage extends React.Component<BoostPageProps> {
  public render(): JSX.Element {
    const id = this.props.match.params.boostId;

    return (
      <>
        <Helmet title="Civil Project Boost - The Civil Registry" />
        <ScrollToTopOnMount />
        <Query query={boostDataQuery} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading) {
              return (
                <BoostSuccessWrap>
                  <LoadingMessage>Loading...</LoadingMessage>
                </BoostSuccessWrap>
              );
            } else if (error) {
              console.error("error loading boost data. error:", error, "data:", data);
              return (
                <BoostSuccessWrap>
                  <h2>Project Boost Launched!</h2>
                  <p>Your Project Boost has successfully launched and is live.</p>
                  <p>
                    <Link to={"/boosts/" + id}>View your Boost</Link>
                  </p>
                  <p>
                    <Link to={"/boosts/" + id + "/edit"}>Edit your Boost</Link>
                  </p>
                </BoostSuccessWrap>
              );
            }

            const { postsGet } = data;

            return (
              <BoostSuccessWrap>
                <BoostSuccess
                  boostId={id}
                  title={postsGet.title}
                  newsroom={postsGet.channel.newsroom.name}
                  newsroomAddress={postsGet.channel.newsroom.multisigAddress}
                  isStripeConnected={postsGet.channel.isStripeConnected}
                />
              </BoostSuccessWrap>
            );
          }}
        </Query>
      </>
    );
  }
}

export default BoostSuccessPage;
