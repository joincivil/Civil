import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Main from "../components/Main";
import Footer from "../components/footer/Footer";
import { NavBar } from "../components/header/NavBar";
import { CivilHelperProvider } from "../apis/CivilHelper";

export const RegistrySection: React.FunctionComponent = () => {
  return (
    <React.Suspense fallback={<></>}>
      <CivilHelperProvider>
        <Switch>
          <Route>
            <>
              <NavBar />
              <Main />
              <Footer />
            </>
          </Route>
        </Switch>
      </CivilHelperProvider>
    </React.Suspense>
  );
};

export default RegistrySection;
