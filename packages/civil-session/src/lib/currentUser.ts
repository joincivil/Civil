import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

import { getApolloSession } from "../utils/apolloClient";
import { getCurrentUserQuery, setCurrentUserMutation } from "../utils/queries";

// TODO(jorgelo): There should be a better interface for all "user" related input fields.
export interface SetCurrentUserInput {
  quizPayload: {};
  quizStatus: "completed" | undefined;
}

export async function getCurrentUser(client: ApolloClient<NormalizedCacheObject>): Promise<any> {
  if (!client || !getApolloSession()) {
    return null;
  }

  try {
    const { errors, data } = await client.query({
      query: getCurrentUserQuery,
    });

    if (errors) {
      return null;
    }

    return (data as any).currentUser;
  } catch (err) {
    console.log("Error in getCurrentUser: ", { err });
    return null;
  }
}

export async function updateQuizPayload(
  client: ApolloClient<NormalizedCacheObject>,
  fields: {},
  newQuizStatus?: string,
): Promise<any> {
  const user = await getCurrentUser(client);

  if (!user) {
    console.error("No user?", { user });
    return;
  }

  const { quizPayload = {}, quizStatus } = user;

  const updateParams = { quizPayload: { ...quizPayload, ...fields }, quizStatus: newQuizStatus || quizStatus };

  await setCurrentUser(client, updateParams);
}

export async function setCurrentUser(
  client: ApolloClient<NormalizedCacheObject>,
  input: Partial<SetCurrentUserInput>,
): Promise<void> {
  try {
    const { data, error } = await client.mutate({
      mutation: setCurrentUserMutation,
      variables: { input },
    });

    if (error) {
      throw error;
    }

    client.cache.writeQuery({
      query: getCurrentUserQuery,
      data: { currentUser: data.userUpdate },
    });
  } catch (err) {
    console.error("Error setCurrentUser", { err, input });
  }
}
