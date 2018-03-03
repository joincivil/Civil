declare module 'slate';
declare module 'slate-react';
declare module '@storybook/addon-storyshots';

interface SlateProps {
  children?: ReactNode;
  [index: string]: any;
}
