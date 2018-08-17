import { AnyAction } from "redux";
import { EthContentHeader } from "@joincivil/core";

export const ADD_REVISION = "ADD_REVISION";
export const ADD_REVISION_JSON = "ADD_REVISION_JSON";

const fetchRevision = async (uri: string) => {
  return new Promise((resolve, reject) => {
    fetch(uri)
      .then(res => res.json())
      .then(json => {
        resolve(json);
      })
      .catch(e => {
        reject(e);
      });
  });
};

export const addRevision = (revision: EthContentHeader): AnyAction => {
  return {
    type: ADD_REVISION,
    data: revision,
  };
};

export const fetchRevisionJson = (uri: string, contentId: number, revisionId: number): any => async (
  dispatch: any,
): Promise<AnyAction> => {
  const json = await fetchRevision(uri);
  return dispatch({
    type: ADD_REVISION_JSON,
    data: {
      contentId,
      revisionId,
      json,
    },
  });
};
