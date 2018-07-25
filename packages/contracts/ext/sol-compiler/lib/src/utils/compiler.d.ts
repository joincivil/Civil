import { ContractSource } from '@0xproject/sol-resolver';
import { ContractArtifact } from './types';
/**
 * Gets contract data on network or returns if an artifact does not exist.
 * @param artifactsDir Path to the artifacts directory.
 * @param contractName Name of contract.
 * @return Contract data on network or undefined.
 */
export declare function getContractArtifactIfExistsAsync(artifactsDir: string, contractName: string): Promise<ContractArtifact | void>;
/**
 * Creates a directory if it does not already exist.
 * @param artifactsDir Path to the directory.
 */
export declare function createDirIfDoesNotExistAsync(dirPath: string): Promise<void>;
/**
 * Searches Solidity source code for compiler version range.
 * @param  source Source code of contract.
 * @return Solc compiler version range.
 */
export declare function parseSolidityVersionRange(source: string): string;
/**
 * Normalizes the path found in the error message. If it cannot be normalized
 * the original error message is returned.
 * Example: converts 'base/Token.sol:6:46: Warning: Unused local variable'
 *          to 'Token.sol:6:46: Warning: Unused local variable'
 * This is used to prevent logging the same error multiple times.
 * @param  errMsg An error message from the compiled output.
 * @return The error message with directories truncated from the contract path.
 */
export declare function getNormalizedErrMsg(errMsg: string): string;
/**
 * Parses the contract source code and extracts the dendencies
 * @param  source Contract source code
 * @return List of dependendencies
 */
export declare function parseDependencies(contractSource: ContractSource): string[];
