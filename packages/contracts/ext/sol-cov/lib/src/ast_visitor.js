"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var BranchType;
(function (BranchType) {
    BranchType["If"] = "if";
    BranchType["ConditionalExpression"] = "cond-expr";
    BranchType["BinaryExpression"] = "binary-expr";
})(BranchType || (BranchType = {}));
var ASTVisitor = /** @class */ (function () {
    function ASTVisitor(locationByOffset, ignoreRangesBeginningAt) {
        if (ignoreRangesBeginningAt === void 0) { ignoreRangesBeginningAt = []; }
        this._entryId = 0;
        this._fnMap = {};
        this._branchMap = {};
        this._modifiersStatementIds = [];
        this._statementMap = {};
        // keep track of contract/function ranges that are to be ignored
        // so we can also ignore any children nodes within the contract/function
        this._ignoreRangesWithin = [];
        this._locationByOffset = locationByOffset;
        this._ignoreRangesBeginningAt = ignoreRangesBeginningAt;
    }
    ASTVisitor.prototype.getCollectedCoverageEntries = function () {
        var coverageEntriesDescription = {
            fnMap: this._fnMap,
            branchMap: this._branchMap,
            statementMap: this._statementMap,
            modifiersStatementIds: this._modifiersStatementIds,
        };
        return coverageEntriesDescription;
    };
    ASTVisitor.prototype.IfStatement = function (ast) {
        this._visitStatement(ast);
        this._visitBinaryBranch(ast, ast.trueBody, ast.falseBody || ast, BranchType.If);
    };
    ASTVisitor.prototype.FunctionDefinition = function (ast) {
        this._visitFunctionLikeDefinition(ast);
    };
    ASTVisitor.prototype.ContractDefinition = function (ast) {
        if (this._shouldIgnoreExpression(ast)) {
            this._ignoreRangesWithin.push(ast.range);
        }
    };
    ASTVisitor.prototype.ModifierDefinition = function (ast) {
        this._visitFunctionLikeDefinition(ast);
    };
    ASTVisitor.prototype.ForStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.ReturnStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.BreakStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.ContinueStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.EmitStatement = function (ast /* TODO: Parser.EmitStatement */) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.VariableDeclarationStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.Statement = function (ast) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.WhileStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.SimpleStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.ThrowStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.DoWhileStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.ExpressionStatement = function (ast) {
        this._visitStatement(ast.expression);
    };
    ASTVisitor.prototype.InlineAssemblyStatement = function (ast) {
        this._visitStatement(ast);
    };
    ASTVisitor.prototype.BinaryOperation = function (ast) {
        var BRANCHING_BIN_OPS = ['&&', '||'];
        if (_.includes(BRANCHING_BIN_OPS, ast.operator)) {
            this._visitBinaryBranch(ast, ast.left, ast.right, BranchType.BinaryExpression);
        }
    };
    ASTVisitor.prototype.Conditional = function (ast) {
        this._visitBinaryBranch(ast, ast.trueExpression, ast.falseExpression, BranchType.ConditionalExpression);
    };
    ASTVisitor.prototype.ModifierInvocation = function (ast) {
        var BUILTIN_MODIFIERS = ['public', 'view', 'payable', 'external', 'internal', 'pure', 'constant'];
        if (!_.includes(BUILTIN_MODIFIERS, ast.name)) {
            if (this._shouldIgnoreExpression(ast)) {
                return;
            }
            this._modifiersStatementIds.push(this._entryId);
            this._visitStatement(ast);
        }
    };
    ASTVisitor.prototype._visitBinaryBranch = function (ast, left, right, type) {
        if (this._shouldIgnoreExpression(ast)) {
            return;
        }
        this._branchMap[this._entryId++] = {
            line: this._getExpressionRange(ast).start.line,
            type: type,
            locations: [this._getExpressionRange(left), this._getExpressionRange(right)],
        };
    };
    ASTVisitor.prototype._visitStatement = function (ast) {
        if (this._shouldIgnoreExpression(ast)) {
            return;
        }
        this._statementMap[this._entryId++] = this._getExpressionRange(ast);
    };
    ASTVisitor.prototype._getExpressionRange = function (ast) {
        var astRange = ast.range;
        var start = this._locationByOffset[astRange[0]];
        var end = this._locationByOffset[astRange[1] + 1];
        var range = {
            start: start,
            end: end,
        };
        return range;
    };
    ASTVisitor.prototype._shouldIgnoreExpression = function (ast) {
        var _a = __read(ast.range, 2), astStart = _a[0], astEnd = _a[1];
        var isRangeIgnored = _.some(this._ignoreRangesWithin, function (_a) {
            var _b = __read(_a, 2), rangeStart = _b[0], rangeEnd = _b[1];
            return astStart >= rangeStart && astEnd <= rangeEnd;
        });
        return this._ignoreRangesBeginningAt.includes(astStart) || isRangeIgnored;
    };
    ASTVisitor.prototype._visitFunctionLikeDefinition = function (ast) {
        if (this._shouldIgnoreExpression(ast)) {
            this._ignoreRangesWithin.push(ast.range);
            return;
        }
        var loc = this._getExpressionRange(ast);
        this._fnMap[this._entryId++] = {
            name: ast.name,
            line: loc.start.line,
            loc: loc,
        };
        this._visitStatement(ast);
    };
    return ASTVisitor;
}());
exports.ASTVisitor = ASTVisitor;
//# sourceMappingURL=ast_visitor.js.map