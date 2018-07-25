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
var path = require("path");
var resolver_1 = require("./resolver");
var RelativeFSResolver = /** @class */ (function (_super) {
    __extends(RelativeFSResolver, _super);
    function RelativeFSResolver(contractsDir) {
        var _this = _super.call(this) || this;
        _this._contractsDir = contractsDir;
        return _this;
    }
    // tslint:disable-next-line:prefer-function-over-method
    RelativeFSResolver.prototype.resolveIfExists = function (importPath) {
        var filePath = path.join(this._contractsDir, importPath);
        if (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()) {
            var fileContent = fs.readFileSync(filePath).toString();
            return {
                source: fileContent,
                path: importPath,
            };
        }
        return undefined;
    };
    return RelativeFSResolver;
}(resolver_1.Resolver));
exports.RelativeFSResolver = RelativeFSResolver;
//# sourceMappingURL=relative_fs_resolver.js.map