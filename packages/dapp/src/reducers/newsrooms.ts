import { Set } from "immutable";
import { AnyAction } from "redux";
import { NewsroomWrapper, EthAddress } from "@joincivil/core";
import { newsroomActions } from "../actionCreators/newsrooms";

export function currentUserNewsrooms(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case newsroomActions.ADD_USER_NEWSROOM:
      return state.add(action.data);
    default:
      return state;
  }
}
