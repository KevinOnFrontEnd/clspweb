import React from "react";

const Output = ({ puzzleHash, compiledProgram, output }) => {
  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Output Section */}
      <div className="flex-grow bg-black text-white rounded-md overflow-auto p-4">
        <h2 className="text-lg font-bold text-gray-400 mb-4">Output</h2>
        <div className="whitespace-pre-wrap text-sm">
          Output: {output || "No output yet."}
          <br />
          Puzzle Hash: {puzzleHash || ""}
          <br />
          Compiled Program: {compiledProgram || ""}
        </div>
      </div>
    </div>
  );
};

export default Output;
