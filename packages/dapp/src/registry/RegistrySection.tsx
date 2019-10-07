import * as React from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { CivilContext, ICivilContext } from "@joincivil/components";
import { standaloneRoutes } from "../constants";
import { Web3AuthWrapper } from "../components/Web3AuthWrapper";
import { GlobalNav } from "../components/GlobalNav";
import Main from "../components/Main";
import Footer from "../components/Footer";
import { analyticsEvent } from "../redux/actionCreators/analytics";

export const RegistrySection: React.FunctionComponent = () => {
  const civilCtx = React.useContext<ICivilContext>(CivilContext);
  const dispatch = useDispatch();

  React.useEffect(() => {
    function fireAnalyticsEvent(category: string, action: string, label: string, value: number): void {
      dispatch!(analyticsEvent({ category, action, label, value }));
    }
    civilCtx.setAnalyticsEvent(fireAnalyticsEvent);
  }, [civilCtx, dispatch]);

  return (
    <React.Suspense fallback={<></>}>
      <Switch>
        {standaloneRoutes.map((route: any) => (
          <Route key={route.pathname} path={route.pathname} component={route.component} />
        ))}
        <Route>
          <>
            <Web3AuthWrapper />
            <GlobalNav />
            <Main />
            <Footer />
          </>
        </Route>
      </Switch>
    </React.Suspense>
  );
};

export default RegistrySection;
