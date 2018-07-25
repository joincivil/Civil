import * as Parser from 'solidity-parser-antlr';
import { BranchMap, FnMap, LocationByOffset, StatementMap } from './types';
export interface CoverageEntriesDescription {
    fnMap: FnMap;
    branchMap: BranchMap;
    statementMap: StatementMap;
    modifiersStatementIds: number[];
}
export declare class ASTVisitor {
    private _entryId;
    private readonly _fnMap;
    private readonly _branchMap;
    private readonly _modifiersStatementIds;
    private readonly _statementMap;
    private readonly _locationByOffset;
    private readonly _ignoreRangesBeginningAt;
    private readonly _ignoreRangesWithin;
    constructor(locationByOffset: LocationByOffset, ignoreRangesBeginningAt?: number[]);
    getCollectedCoverageEntries(): CoverageEntriesDescription;
    IfStatement(ast: Parser.IfStatement): void;
    FunctionDefinition(ast: Parser.FunctionDefinition): void;
    ContractDefinition(ast: Parser.ContractDefinition): void;
    ModifierDefinition(ast: Parser.ModifierDefinition): void;
    ForStatement(ast: Parser.ForStatement): void;
    ReturnStatement(ast: Parser.ReturnStatement): void;
    BreakStatement(ast: Parser.BreakStatement): void;
    ContinueStatement(ast: Parser.ContinueStatement): void;
    EmitStatement(ast: any): void;
    VariableDeclarationStatement(ast: Parser.VariableDeclarationStatement): void;
    Statement(ast: Parser.Statement): void;
    WhileStatement(ast: Parser.WhileStatement): void;
    SimpleStatement(ast: Parser.SimpleStatement): void;
    ThrowStatement(ast: Parser.ThrowStatement): void;
    DoWhileStatement(ast: Parser.DoWhileStatement): void;
    ExpressionStatement(ast: Parser.ExpressionStatement): void;
    InlineAssemblyStatement(ast: Parser.InlineAssemblyStatement): void;
    BinaryOperation(ast: Parser.BinaryOperation): void;
    Conditional(ast: Parser.Conditional): void;
    ModifierInvocation(ast: Parser.ModifierInvocation): void;
    private _visitBinaryBranch(ast, left, right, type);
    private _visitStatement(ast);
    private _getExpressionRange(ast);
    private _shouldIgnoreExpression(ast);
    private _visitFunctionLikeDefinition(ast);
}
