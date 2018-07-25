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
var resolver_1 = require("./resolver");
var EnumerableResolver = /** @class */ (function (_super) {
    __extends(EnumerableResolver, _super);
    function EnumerableResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EnumerableResolver;
}(resolver_1.Resolver));
exports.EnumerableResolver = EnumerableResolver;
//# sourceMappingURL=enumerable_resolver.js.map