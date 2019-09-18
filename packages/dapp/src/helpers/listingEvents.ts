import {
  EthAddress,
  StorageHeader,
} from "@joincivil/core";
import { addNewsroom, setNewsroomMultisigAddress } from "@joincivil/newsroom-signup";
import { Dispatch } from "react-redux";
import { Subscription } from "rxjs";
import { addUserNewsroom, addContent, addCharterRevision } from "../redux/actionCreators/newsrooms";
import { getCivil } from "./civilInstance";

const allNewsroomContentRevisionsSubscriptions = new Map<EthAddress, Subscription>();

export async function getNewsroom(dispatch: Dispatch<any>, address: EthAddress): Promise<void> {
  const civil = getCivil();
  const user = await civil.accountStream.first().toPromise();
  const newsroom = await civil.newsroomAtUntrusted(address);
  const wrapper = await newsroom.getNewsroomWrapper();
  dispatch(addNewsroom({ wrapper, address: civil.toChecksumAddress(wrapper.address), newsroom }));
  if (user && wrapper.data.owners.includes(user)) {
    const multiSigAddr = await newsroom.getMultisigAddress();
    dispatch(setNewsroomMultisigAddress(address, multiSigAddr || ""));
    dispatch(addUserNewsroom(address));
  }

  const newsroomCharterRevisionsSubscription = newsroom.revisions(0).subscribe(charterRevision => {
    const { revisionId } = charterRevision;
    dispatch(addCharterRevision(address, revisionId!, charterRevision));
  });

  allNewsroomContentRevisionsSubscriptions.set(address, newsroomCharterRevisionsSubscription);
}

async function delay(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getIPFSContent(
  header: StorageHeader,
  dispatch: Dispatch<any>,
  wait: number = 1000,
  tries: number = 0,
): Promise<void> {
  const civil = getCivil();
  const content = await civil.getContent(header);
  if (content) {
    const parsedContent = JSON.parse(content.toString());
    dispatch(addContent(header, parsedContent));
  } else {
    console.warn("Missing IPFS content for header:", header);
    if (header.uri !== "" && tries < 6) {
      console.warn("Retrying getIPFSContent. wait = " + wait + "ms");
      await delay(wait);
      return getIPFSContent(header, dispatch, wait * 2, tries + 1);
    } else if (header.uri !== "" && tries >= 6) {
      console.error("Unable to find IPFS content after 6 tries. header: ", header);
    }
  }
}
