import { Map, Set } from "immutable";
import { AnyAction } from "redux";
import { NewsroomWrapper } from "@joincivil/core";
import { newsroomActions } from "../actionCreators/newsrooms";

export function newsrooms(
  state: Map<string, NewsroomWrapper> = Map<string, NewsroomWrapper>({"": {data: {}}}),
  action: AnyAction,
): Map<string, NewsroomWrapper> {
  console.log({action});
  switch (action.type) {
    case newsroomActions.ADD_NEWSROOM:
      return state.set(action.data.address, action.data);
    case newsroomActions.UPDATE_NEWSROOM:
      return state.set(action.data.address, {
        address: action.data.address,
        data: {
          ...state.get(action.data.address).data,
          ...action.data.data
        }
      });
    default:
      return state;
  }
}

export function currentUserNewsrooms(state: Set<string> = Set<string>(), action: AnyAction): Set<string> {
  switch (action.type) {
    case newsroomActions.ADD_USER_NEWSROOM:
      return state.add(action.data);
    default:
      return state;
  }
}
