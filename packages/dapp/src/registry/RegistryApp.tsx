import * as React from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { CivilContext, ICivilContext } from "@joincivil/components";
import { Web3AuthWrapper } from "../components/Web3AuthWrapper";
import Main from "../components/Main";
import Footer from "../components/footer/Footer";
import { analyticsEvent } from "../redux/actionCreators/analytics";
import { NavBar } from "../components/header/NavBar";
import { CivilHelperProvider } from "../apis/CivilHelper";

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
      <CivilHelperProvider>
        <Switch>
          <Route>
            <>
              <NavBar />
              <Main />
              <Footer />
              <Web3AuthWrapper />
            </>
          </Route>
        </Switch>
      </CivilHelperProvider>
    </React.Suspense>
  );
};

export default RegistrySection;
