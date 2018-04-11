import * as React from "react";

export interface BytecodeProps {
  contract: any;
}

const Bytecode: React.SFC<BytecodeProps> = props => {
  const { contract } = props;
  return (
    <div className="bytecode">
      {contract.bin && (
        <div className="bin">
          <h3>Hex</h3>
          <pre className="wrap">
            <code>{contract.bin}</code>
          </pre>
        </div>
      )}
      {contract.opcodes && (
        <div className="opcodes">
          <h3>Opcodes</h3>
          <pre className="wrap">
            <code>{contract.opcodes}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default Bytecode;
