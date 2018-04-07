import * as path from "path";
import toSnakeCase = require("to-snake-case");

export interface ContextData {
  files: path.ParsedPath[];
}

export const helpers = {
  capitalize: (what: string) =>
    what
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" "),
  snakecase: toSnakeCase,
};
