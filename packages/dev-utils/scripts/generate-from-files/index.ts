import * as Debug from "debug";
import * as fs from "fs";
import * as glob from "glob";
import * as Handlebars from "handlebars";
import * as mkdirp from "mkdirp";
import * as path from "path";

import { ContextData, helpers } from "./utils";

const debug = Debug("generate-from-files");

export async function generateFromFiles(
    inputGlob: string,
    templateFile: string,
    outFile: string, logger: (...params: any[]) => void = debug): Promise<void> {
  const options: glob.IOptions = {
    silent: true, // we throw the error
    strict: true,
    nodir: true, // Can't open a dir for reading
  };
  const inputs = glob.sync(inputGlob, options);
  if (!inputs.length) {
    throw new Error("No input files found");
  }
  logger(`Found ${inputs.length} input files`);

  mkdirp.sync(path.dirname(outFile));

  const fileData = inputs.map(path.parse);

  const context = {
    files: fileData,
  };

  Handlebars.registerHelper(helpers);

  logger("Rendering: " + templateFile);
  const templateString = fs
    .readFileSync(templateFile)
    .toString();
  const templateRenderer = Handlebars.compile<ContextData>(templateString);
  fs.writeFileSync(outFile, templateRenderer(context));
  logger("Wrote: " + outFile);
}
