import { CompilerOptions } from './utils/types';
/**
 * The Compiler facilitates compiling Solidity smart contracts and saves the results
 * to artifact files.
 */
export declare class Compiler {
    private readonly _resolver;
    private readonly _nameResolver;
    private readonly _contractsDir;
    private readonly _compilerSettings;
    private readonly _artifactsDir;
    private readonly _solcVersionIfExists;
    private readonly _specifiedContracts;
    /**
     * Instantiates a new instance of the Compiler class.
     * @return An instance of the Compiler class.
     */
    constructor(opts?: CompilerOptions);
    /**
     * Compiles selected Solidity files found in `contractsDir` and writes JSON artifacts to `artifactsDir`.
     */
    compileAsync(): Promise<void>;
    /**
     * Compiles contract and saves artifact to artifactsDir.
     * @param fileName Name of contract with '.sol' extension.
     */
    private _compileContractAsync(contractName);
    /**
     * Gets the source tree hash for a file and its dependencies.
     * @param fileName Name of contract file.
     */
    private _getSourceTreeHash(importPath);
}
