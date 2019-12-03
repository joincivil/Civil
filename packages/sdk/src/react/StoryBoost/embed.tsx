import * as React from "react";
import * as ReactDOM from "react-dom";
import gql from "graphql-tag";
import { ApolloProvider, Mutation, Query } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { BoostEmbedIframe } from "../boosts/BoostEmbedIframe";

const GET_LINK_QUERY = gql`
  query($reference: String!) {
    postsGetByReference(reference: $reference) {
      id
    }
  }
`;
const CREATE_LINK_MUTATION = gql`
  mutation($input: PostCreateExternalLinkInput!) {
    postsCreateExternalLinkEmbedded(input: $input) {
      id
    }
  }
`;

// Need to declare this out here because this reference is lost during callbacks
const currentScript: HTMLScriptElement | null = document.currentScript as any;
if (!currentScript) {
  throw Error("Civil Boost Embed: Failed to get document.currentScript");
}
const ENVIRONMENT =
  currentScript.src && currentScript.src.indexOf("registry.civil.co") !== -1 ? "production" : "staging";

let dappOrigin = ENVIRONMENT === "production" ? "https://registry.civil.co" : "https://staging.civil.app";
if (currentScript.src.indexOf("localhost:3001") !== -1) {
  dappOrigin = "http://localhost:3000";
}
const fallbackFallbackUrl = dappOrigin + "/storyfeed"; // if embed doesn't load, suggest they go here

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri:
      ENVIRONMENT === "production" ? "https://graphql.civil.co/v1/query" : "https://graphql.staging.civil.app/v1/query",
  }),
});

function getPostUrl(): string {
  let url = ((document.querySelector("link[rel=canonical]") as HTMLLinkElement) || {}).href;
  if (!url) {
    url = ((document.querySelector("meta[property='og:url'") as HTMLMetaElement) || {}).content;
  }
  if (!url) {
    url = document.location.href;
  }

  // @TODO/tobek dev/temp testing - we don't want to post a localhost dev page to civil, so pick another URL
  if (document.location.origin.indexOf("localhost") !== -1) {
    const FALLBACK_STORY =
      "https://blockclubchicago.org/2019/11/04/south-sides-own-sweet-potato-patch-will-deliver-healthy-food-to-homes-in-food-deserts/";
    url = window.prompt("enter a URL to get/create", FALLBACK_STORY) || FALLBACK_STORY;
  }

  return url;
}

function init(): void {
  const url = getPostUrl();

  const renderContainer = document.createElement("div");
  renderContainer.classList.add("civil-story-boost-wrapper");
  renderContainer.style.maxWidth = "500px";
  renderContainer.style.margin = "0 auto";
  currentScript!.parentNode!.insertBefore(renderContainer, currentScript);

  ReactDOM.render(
    // @ts-ignore: bugs with apollo types e.g. https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/166
    <ApolloProvider client={apolloClient}>
      <Query<any> query={GET_LINK_QUERY} variables={{ reference: "externallink+" + url }}>
        {({ loading: getLoading, error: getError, data: getData }) => {
          if (getLoading) {
            return <BoostEmbedIframe noIframe={true} fallbackUrl={fallbackFallbackUrl} />;
          }
          if (getError) {
            // If "could not find post" that's fine, we'll create it with mutation, but if it's a different error then bomb:
            if (getError.message.indexOf("could not find post") === -1) {
              console.error("Error getting boost ID via postsGetByReference for url", url, "error:", getError);
              return (
                <BoostEmbedIframe
                  noIframe={true}
                  fallbackUrl={fallbackFallbackUrl}
                  error={"Error getting boost ID: " + getError.message || getError.toString()}
                />
              );
            }
          }
          if (!getData || !getData.postsGetByReference || !getData.postsGetByReference.id) {
            return (
              <Mutation<any>
                mutation={CREATE_LINK_MUTATION}
                variables={{ input: { url, channelID: "@TODO/tobek remove when API updated" } }}
              >
                {(mutation, { loading: createLoading, data: createData, error: createError, called: createCalled }) => {
                  if (!createCalled && !createError) {
                    console.warn("Attempting to post external link to Civil:", url);
                    window.setTimeout(mutation, 0);
                    return <BoostEmbedIframe noIframe={true} fallbackUrl={fallbackFallbackUrl} />;
                  }
                  if (createLoading) {
                    return <BoostEmbedIframe noIframe={true} fallbackUrl={fallbackFallbackUrl} />;
                  }
                  if (createError || !createData || !createData.postsCreateExternalLinkEmbedded) {
                    console.error(
                      "Error posting link via postsCreateExternalLinkEmbedded",
                      url,
                      createError,
                      createData,
                    );
                    return (
                      <BoostEmbedIframe
                        noIframe={true}
                        fallbackUrl={fallbackFallbackUrl}
                        error={
                          "Error posting link to Civil: " +
                          (createError ? createError.message || createError.toString() : "no data returned")
                        }
                      />
                    );
                  }

                  const newBoostId = createData.postsCreateExternalLinkEmbedded.id;
                  const newLinkEmbedUrl = `${dappOrigin}/embed/boost/story/${newBoostId}`;
                  return (
                    <BoostEmbedIframe iframeSrc={newLinkEmbedUrl} fallbackUrl={newLinkEmbedUrl} iframeId={newBoostId} />
                  );
                }}
              </Mutation>
            );
          }

          const boostId = getData.postsGetByReference.id;
          const embedUrl = `${dappOrigin}/embed/boost/story/${boostId}`;
          return (
            // @TODO/tobek Since we don't have a permalink for story boost on dapp, for now the fallback URL can go directly to same embed URL, which should work outside iframe even if privacy badger or something is blocking in iframe.
            <BoostEmbedIframe iframeSrc={embedUrl} fallbackUrl={embedUrl} iframeId={boostId} />
          );
        }}
      </Query>
    </ApolloProvider>,
    renderContainer,
  );
}

if (document.readyState === "complete") {
  init();
} else {
  window.addEventListener("load", init);
}
