/**
 * Compares two hex arrays of smart-contracts deployed code
 * Deployed bytecode can't be compared 1:1, because of the metadata at the end
 */
export function isDeployedBytecodeEqual(deployed1: string, deployed2: string): boolean {
  return deployed1 === deployed2;
}
