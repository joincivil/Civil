import initStoryshots, { getSnapshotFileName } from "@storybook/addon-storyshots";
import * as Enzyme from "enzyme";

initStoryshots({
  test: ({ story, context }: { story: any; context: any }) => {
    const snapshotFileName = getSnapshotFileName(context);
    const storyElement = story.render(context);
    const mounted = Enzyme.render(storyElement);
    if (snapshotFileName) {
      (expect as any)(mounted).toMatchSpecificSnapshot(snapshotFileName);
    }
  },
});
