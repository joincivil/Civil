import * as React from "react";

import { storiesOf } from "@storybook/react";
import { CivilContext, ICivilContext } from "../react/CivilProvider";

export const RegistryExample = () => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  const [status, setStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!civilContext.loading) {
      civilContext.civil.registry
        .getRegistryStatus()
        .then(res => {
          setStatus(res);
        })
        .catch(e => {
          throw e;
        });
      console.log("called getRegistryStatus", civilContext.loading);
      civilContext.civil.lockbox.getKey("test").catch(e => {
        throw e;
      });
    }
  }, [civilContext.loading]);

  if (civilContext.loading) {
    return <div>loading...</div>;
  }

  return <div>status returned: {status}</div>;
};

storiesOf("Registry", module).add("hello world", () => <RegistryExample />);
