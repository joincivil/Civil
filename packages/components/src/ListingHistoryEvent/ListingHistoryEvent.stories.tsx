import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import * as React from "react";
import styled from "styled-components";
import { ListingHistoryEvent } from "./ListingHistoryEvent";
import { ApplicationEvent } from "./ApplicationEvent";
import { ChallengeEvent } from "./ChallengeEvent";
import { ChallengeFailedEvent } from "./ChallengeFailedEvent";
import { ChallengeSucceededEvent } from "./ChallengeSucceededEvent";
import { RejectedEvent } from "./RejectedEvent";
import { WhitelistedEvent } from "./WhitelistedEvent";

const StyledDiv = styled.div`
  width: 600px;
`;

const Container: React.StatelessComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("Listing History Event", module)
  .addDecorator(StoryRouter())
  .add("Default", () => {
    const props = {
      timestamp: new Date().valueOf() / 1000,
      title: "A Default Event",
    };

    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <>
            <ListingHistoryEvent {...props} />
          </>
        )}
      </Container>
    );
  })
  .add("History Events Timelime", () => {
    const timestamp = new Date().valueOf() / 1000;
    const deposit = "100.00 CVL";
    const challengeID = "1";
    const challenger = "0x8c722b8ac728add7780a66017e8dadba530ee261";

    return (
      <Container>
        {process.env.NODE_ENV !== "test" && (
          <>
            <RejectedEvent timestamp={timestamp} />
            <ChallengeSucceededEvent
              timestamp={timestamp}
              totalVotes="100.00 CVL"
              votesFor="80.00 CVL"
              votesAgainst="20.00 CVL"
              percentFor="20"
              percentAgainst="80"
              didChallengeSucceed={true}
            />
            <ChallengeFailedEvent
              timestamp={timestamp}
              totalVotes="100.00 CVL"
              votesFor="20.00 CVL"
              votesAgainst="80.00 CVL"
              percentFor="20"
              percentAgainst="80"
              didChallengeSucceed={false}
            />
            <ChallengeEvent
              timestamp={timestamp}
              challenger={challenger}
              challengeID={challengeID}
              challengeURI="/challenge/1"
            />
            <WhitelistedEvent timestamp={timestamp} />
            <ApplicationEvent timestamp={timestamp} deposit={deposit} />
          </>
        )}
      </Container>
    );
  });
