import gql from "graphql-tag";
import { Query } from "react-apollo";
import * as React from "react";
import { Link } from "react-router-dom";
import { formatRoute } from "react-router-named-routes";
import {
  CivilContext,
  ICivilContext,
  LoadingMessage,
  ErrorLoadingData,
  ViewTransactionLink,
  QuestionToolTip,
} from "@joincivil/components";
import { AccountTransactionsTable, NoWrapTd } from "./AccountStyledComponents";
import { TransactionsTitleText } from "./AccountTextComponents";
import { routes } from "../../../constants";
import { UserManagementSection } from "../UserManagement";

export const paymentHistoryQuery = gql`
  query {
    currentUser {
      userChannel {
        paymentsMadeByChannel {
          __typename
          status
          reaction
          comment
          currencyCode
          exchangeRate
          amount
          createdAt
          updatedAt
          usdEquivalent
          ... on PaymentEther {
            transactionID
          }
          post {
            id
            postType
            channel {
              handle
              newsroom {
                name
                contractAddress
              }
            }
            ... on PostBoost {
              title
            }
            ... on PostExternalLink {
              openGraphData {
                title
              }
            }
          }
        }
      }
    }
  }
`;

interface PostData {
  id: string;
  postType: string;
  channel: {
    handle?: string;
    newsroom: {
      name: string;
      contractAddress: string;
    };
  };
  title?: string;
  openGraphData?: {
    title: string;
  };
}
interface TransactionData {
  __typename: string;
  id: string;
  status?: string;
  currencyCode: string;
  exchangeRate: number;
  amount: number;
  createdAt: string;
  usdEquivalent: number;
  transactionID?: string;
  post: PostData;
}
interface PaymentHistoryData {
  currentUser: {
    userChannel: {
      paymentsMadeByChannel?: TransactionData[];
    };
  };
}

const SUPPORTED_PAYMENT_TYPES = ["PaymentStripe", "PaymentEther"];
const SUPPORTED_POST_TYPES = ["externallink", "boost"];

export const AccountTransactions: React.FunctionComponent = () => {
  const context = React.useContext<ICivilContext>(CivilContext);

  if (context.auth.loading) {
    return <LoadingMessage>Loading User</LoadingMessage>;
  } else if (!context.currentUser) {
    return <>Please log in to view your transaction history</>;
  }

  return (
    <UserManagementSection header={<TransactionsTitleText />}>
      <Query<PaymentHistoryData> query={paymentHistoryQuery}>
        {({ loading, data, error }) => {
          if (loading) {
            return <LoadingMessage>Loading Transactions</LoadingMessage>;
          } else if (error || !data) {
            console.error("error querying currentUser for paymentsMadeByChannel:", error || "no data returned");
            return <ErrorLoadingData />;
          } else if (!data.currentUser.userChannel.paymentsMadeByChannel) {
            return (
              <p>
                You have made no transactions yet. Head on over to the{" "}
                <Link to={formatRoute(routes.STORY_FEED)}>Civil story feed</Link> to find great work that deserves your
                support!
              </p>
            );
          }

          const transactions = data.currentUser.userChannel.paymentsMadeByChannel
            .filter(
              transaction =>
                SUPPORTED_PAYMENT_TYPES.indexOf(transaction.__typename) !== -1 &&
                SUPPORTED_POST_TYPES.indexOf(transaction.post.postType) !== -1,
            )
            .sort((tA, tB) => new Date(tB.createdAt).getTime() - new Date(tA.createdAt).getTime());

          return (
            <AccountTransactionsTable>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Newsroom</th>
                  <th>Title</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <TransactionRow {...transaction} key={transaction.createdAt} />
                ))}
              </tbody>
            </AccountTransactionsTable>
          );
        }}
      </Query>
    </UserManagementSection>
  );
};

const TransactionRow: React.FunctionComponent<TransactionData> = props => {
  const context = React.useContext<ICivilContext>(CivilContext);
  const date = new Date(props.createdAt);
  return (
    <tr>
      <td>
        <abbr title={date.toString()}>
          <time dateTime={props.createdAt}>{date.toLocaleDateString()}</time>
        </abbr>
      </td>
      <td>
        <Link
          to={formatRoute(routes.LISTING, {
            listingAddress: props.post.channel.handle || props.post.channel.newsroom.contractAddress,
          })}
        >
          {props.post.channel.newsroom.name}
        </Link>
      </td>
      <td>
        <Link to={formatRoute(routes.STORY_FEED, { postId: props.post.id })}>
          {props.post.title || props.post.openGraphData!.title}
        </Link>
      </td>
      <td>{props.__typename === "PaymentEther" ? "ETH" : "Card"}</td>
      <NoWrapTd>
        {props.__typename === "PaymentEther" ? (
          <ViewTransactionLink
            network={context.network === 1 ? "mainnet" : "rinkeby"}
            txHash={props.transactionID!}
            text={props.status}
          />
        ) : (
          "complete"
        )}
      </NoWrapTd>
      <NoWrapTd>
        ${props.usdEquivalent.toFixed(2)}
        {props.currencyCode !== "usd" && (
          <QuestionToolTip
            explainerText={`${props.amount} ${props.currencyCode} at \$${props.exchangeRate}/${props.currencyCode}`}
          />
        )}
      </NoWrapTd>
    </tr>
  );
};
