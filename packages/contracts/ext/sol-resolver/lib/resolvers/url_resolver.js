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
var URLResolver = /** @class */ (function (_super) {
    __extends(URLResolver, _super);
    function URLResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // tslint:disable-next-line:prefer-function-over-method
    URLResolver.prototype.resolveIfExists = function (importPath) {
        var FILE_URL_PREXIF = 'file://';
        if (importPath.startsWith(FILE_URL_PREXIF)) {
            var filePath = importPath.substr(FILE_URL_PREXIF.length);
            var fileContent = fs.readFileSync(filePath).toString();
            return {
                source: fileContent,
                path: importPath,
            };
        }
        return undefined;
    };
    return URLResolver;
}(resolver_1.Resolver));
exports.URLResolver = URLResolver;
//# sourceMappingURL=url_resolver.js.map