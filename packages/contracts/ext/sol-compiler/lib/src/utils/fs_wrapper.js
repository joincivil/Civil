"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0xproject/utils");
var fs = require("fs");
var mkdirp = require("mkdirp");
exports.fsWrapper = {
    readdirAsync: utils_1.promisify(fs.readdir),
    readFileAsync: utils_1.promisify(fs.readFile),
    writeFileAsync: utils_1.promisify(fs.writeFile),
    mkdirpAsync: utils_1.promisify(mkdirp),
    doesPathExistSync: fs.existsSync,
    rmdirSync: fs.rmdirSync,
    removeFileAsync: utils_1.promisify(fs.unlink),
};
//# sourceMappingURL=fs_wrapper.js.map