import initStoryshots, { getSnapshotFileName } from '@storybook/addon-storyshots';
import * as Enzyme from "enzyme";
import * as path from "path";
import * as ReactTestRenderer from "react-test-renderer";

initStoryshots({
  test: ({story, context}: {story: any; context: any}) => {
    const snapshotFileName = getSnapshotFileName(context);
    const storyElement = story.render(context);
    const mounted = Enzyme.render(storyElement);
    if (snapshotFileName) {
        (expect as any)(mounted)
        .toMatchSpecificSnapshot(snapshotFileName);
    }
  },
});
