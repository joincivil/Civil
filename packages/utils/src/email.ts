import * as querystring from "querystring";

// TODO(jorgelo): Drop this into a configuration.
const SIGNUP_ENDPOINT = "https://us-central1-civil-media.cloudfunctions.net/addToSendgrid";
export const TCR_SENDGRID_STAGING_LIST_ID = "5353193";
export const TCR_SENDGRID_PROD_LIST_ID = "6903287";

export function isValidEmail(email: string): boolean {
  const emailRegex = /[^@]+@[^\.]+\..+/;
  return emailRegex.test(email);
}

export async function addToMailingList(
  email: string,
  listId: string,
  successCallback?: () => void,
  errorCallback?: () => void,
): Promise<void> {
  const query = {
    email,
    list_id: listId,
  };

  const url = SIGNUP_ENDPOINT + "?" + querystring.stringify(query);

  try {
    const res = await fetch(url);

    const body: any = await res.json();
    if (body.status && body.status === "ERROR") {
      throw new Error("There was a problem with your email signup. Please check the email you entered and try again.");
    }
  } catch (err) {
    // TODO(jorgelo): Should we call errorCallback on error?
    throw err;
  }
}
