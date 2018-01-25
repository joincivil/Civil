import * as fs from "fs";
import * as glob from "glob";
import * as mkdirp from "mkdirp";
import * as path from "path";

/*
 * Artifacts in the newest version of Truffle have a lot of data we don't need nor want in our library
 * We're striping it to not leak and also have easier time managing JSONs
 * The only things we're leaving are:
 * - contractName
 * - abi
 * - bytecode (for deploying)
 * - deployedBytecode (for source code confirming)
 * - networks
 */

const JSON_WHITESPACE = 4;
const EXPECTED_ARGUMENT_COUNT = 4;
const ARGV_INPUT_GLOV = 2;
const ARGV_OUT_DIR = 3;

function strip(filePath: string, outPath: string): void {
  const data = JSON.parse(fs.readFileSync(filePath) as any);
  /* tslint:disable object-literal-sort-keys */
  const filtered = {
    contractName: data.contractName,
    bytecode: data.bytecode,
    deployedBytecode: data.deployedBytecode,
    abi: data.abi,
    networks: data.networks,
  };
  /* tslint:enable object-literal-sort-keys */
  fs.writeFileSync(outPath, JSON.stringify(filtered, null, JSON_WHITESPACE));
  console.log("Written: " + outPath);
}

if (process.argv.length !== EXPECTED_ARGUMENT_COUNT) {
  console.error("Usage: " + process.argv[0] + " json_files_glob out_dir");
  process.exit();
}

const FILES_GLOB = process.argv[ARGV_INPUT_GLOV];
const OUT_DIR = process.argv[ARGV_OUT_DIR];

// Ensure out directory exists
mkdirp.sync(OUT_DIR);

glob(FILES_GLOB, (err, files) => {
  if (err) {
    console.error("Failed to parse glob", err);
    return process.exit(1);
  }

  files.forEach((filePath) => {
    const filename = path.basename(filePath);
    const outPath = path.posix.format({
      base: filename,
      dir: OUT_DIR,
    } as any);
    strip(filePath, outPath);
  });
});
