"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var resolver_1 = require("./resolver");
var FSResolver = /** @class */ (function (_super) {
    __extends(FSResolver, _super);
    function FSResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // tslint:disable-next-line:prefer-function-over-method
    FSResolver.prototype.resolveIfExists = function (importPath) {
        if (fs.existsSync(importPath) && fs.lstatSync(importPath).isFile()) {
            var fileContent = fs.readFileSync(importPath).toString();
            return {
                source: fileContent,
                path: importPath,
            };
        }
        return undefined;
    };
    return FSResolver;
}(resolver_1.Resolver));
exports.FSResolver = FSResolver;
//# sourceMappingURL=fs_resolver.js.map