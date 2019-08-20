module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "src/__test__/setupTests.ts", "build"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>src/__mocks__/fileMock.js",
  },
  testRegex: "(src/__test__/.*|\\.(test|spec))\\.(ts|tsx)$",
  setupFiles: ["<rootDir>.storybook/register-context.ts"],
  setupFilesAfterEnv: ["<rootDir>src/__test__/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
};
