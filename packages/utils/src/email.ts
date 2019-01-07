import * as querystring from "querystring";

// TODO(jorgelo): Drop this into a configuration.
const SIGNUP_ENDPOINT = "https://us-central1-civil-media.cloudfunctions.net/addToSendgrid";
export const TCR_SENDGRID_LIST_ID = "5353193";

export async function addToMailingList(email: string, listId: string): Promise<void> {
  const query = {
    email,
    list_id: listId,
  };

  const url = SIGNUP_ENDPOINT + "?" + querystring.stringify(query);

  try {
    const res = await fetch(url);

    // TODO(jorgelo): Do something with the error response
    // const body: any = await res.json();

    await res.json();
  } catch (err) {
    // TODO(jorgelo): Log error somewhere on error?
    // console.error("Error:", { err });
    throw err;
  }
}
