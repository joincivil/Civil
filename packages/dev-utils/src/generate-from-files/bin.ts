#!/usr/bin/env node
import { ArgumentParser } from "argparse";

import { generateFromFiles } from "./index";

const USAGE = `
This tool is a script for the civil.ts library.
It allows generating source file from a glob input and using Mustache template

First argument accepted is a glob of the files for the input,
second is a file to be treadet as template
third is the output filena,e

It's in this packages because compiling civil.ts requires the generate artifacts file
to work, so we can't easily generate the script using the config from there.
And so we're gonna make it a seperate binary
`;

const parser = new ArgumentParser({
  addHelp: true,
  description: USAGE,
  prog: "generate-from-files",
});
parser.addArgument(
  [ "inputGlob" ],
  {
    help: "Files that will be put as context for the template",
  },
);
parser.addArgument(
  [ "templateFile" ],
  {
    help: "Mustache template file that will be rendered",
  },
);
parser.addArgument(
  [ "outFile" ],
  {
    help: "File that the rendered tempalate will be saved",
  },
);
const args = parser.parseArgs();

const { inputGlob, templateFile, outFile } = args;
generateFromFiles(inputGlob, templateFile, outFile, console.log.bind(console))
  .catch((error) => {
    console.error("Failed to parse", error);
    process.exit(1);
  });
