import * as React from "react";

import { Footer as FooterComponent } from "@joincivil/components";

const Footer: React.SFC = props => {
  const currentYear = new Date().getFullYear().toString();
  return <FooterComponent currentYear={currentYear} />;
};

export default Footer;
