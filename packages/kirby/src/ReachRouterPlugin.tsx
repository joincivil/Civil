import { MiddlewareAPI, Action } from "redux";
import { Dispatch } from "react";
import { ChildPlugin, REQUEST_VIEW_ACTION, COMPLETE_VIEW_ACTION } from "@kirby-web3/child-core";
import { navigate } from "@reach/router";

export class ReachRouterPlugin extends ChildPlugin {
  public name = "reachRouter";

  public middleware = (api: MiddlewareAPI<any>) => (next: Dispatch<any>) => <A extends Action>(action: any): void => {
    if (action.type === REQUEST_VIEW_ACTION) {
      navigate(action.payload.route);
    }
    if (action.type === COMPLETE_VIEW_ACTION) {
      navigate("/");
    }
    next(action);
  };

  public reducer(state: any = {}, action: any): any {
    return state;
  }
}
