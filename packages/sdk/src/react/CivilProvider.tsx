import * as React from "react";
import { Civil } from "../sdk";

export interface ICivilContext {
  loading: boolean;
  civil: Civil;
}

const defaultContext: ICivilContext = {
  loading: true,
  civil: new Civil(),
};

export const CivilContext = React.createContext(defaultContext);

export const CivilProvider: React.FunctionComponent = ({ children }) => {
  const [context, setContext] = React.useState<ICivilContext>(defaultContext);

  React.useMemo(() => {
    context.civil.onLoad(() => {
      setContext({
        loading: false,
        civil: context.civil,
      });
    });
  }, []);

  return (
    <>
      <CivilContext.Provider value={context}>{children}</CivilContext.Provider>
    </>
  );
};
