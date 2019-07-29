import * as React from "react";

export default function AsyncComponent(Component: React.LazyExoticComponent<any>, extraProps?: any): any {
  return (props: any) => (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component {...props} {...extraProps} />
    </React.Suspense>
  );
}
