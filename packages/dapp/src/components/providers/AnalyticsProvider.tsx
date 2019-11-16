import * as React from "react";
import { useDispatch } from "react-redux";
import { CivilContext, ICivilContext } from "@joincivil/components";
import { analyticsEvent } from "../../redux/actionCreators/analytics";
import { catchWindowOnError } from "../../redux/actionCreators/errors";

export const AnalyticsProvider: React.FunctionComponent = ({ children }) => {
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  const dispatch = useDispatch();

  React.useEffect(() => {
    function fireAnalyticsEvent(category: string, action: string, label: string, value: number): void {
      dispatch!(analyticsEvent({ category, action, label, value }));
    }
    civilCtx.setAnalyticsEvent(fireAnalyticsEvent);

    window.onerror = (message: string, source: string, lineNum: string, colNum: string, errorObj: any) => {
      dispatch!(catchWindowOnError(message, source, lineNum, colNum, errorObj));
    };
  }, [civilCtx, dispatch]);

  return <>{children}</>;
};

export default AnalyticsProvider;
