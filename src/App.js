import React, { useState } from "react";
import pkg from "clvm-lib";

function App() {
  const [source, setSource] = useState("");
  const [curry, setCurry] = useState("");
  const [byteCode, setByteCode] = useState("");
  const [puzzleHash, setPuzzleHash] = useState("");
  const { Program } = pkg;

  const handleCompile = () => {
    // Parse the Chialisp source code
    const program = Program.fromSource(source);

    if (curry !== "") {
      const curryProgram = Program.fromSource(curry);

      const compiledOutput = program.run(curryProgram);
      setByteCode(compiledOutput.value.toString());
    } else {
      // Compile the program
      const compiledOutput = program.compile();
      const compiledPuzzle = compiledOutput.value.toString();
      console.log(compiledPuzzle);

      setByteCode(compiledOutput.value.toString());

      const puzzleHash = compiledOutput.value.hashHex();
      setPuzzleHash(puzzleHash);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(puzzleHash).then(() => {
      alert("Puzzle Hash copied to clipboard!");
    });
  };

  return (
    <div className="p-6 font-sans">
      {/* Warning Banner */}
      <div className="p-4 mb-6 text-center text-white bg-red-600 rounded-md">
        ⚠️ This is a pre-alpha release and is not fully functional. Use at your own risk.
      </div>

      {/* Top Section */}
      <div className="flex gap-4 mb-6">
        {/* Source Section */}
        <div className="flex-1">
          <label htmlFor="source" className="block mb-2 font-bold text-lg">
            Source
          </label>
          <textarea
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source code..."
            rows="20"
            className="w-full p-4 text-base border border-gray-300 rounded-md resize-none"
          />
        </div>
        {/* Curry Section */}
        <div className="flex-2">
          <label htmlFor="curry" className="block mb-2 font-bold text-lg">
            Curry
          </label>
          <textarea
            id="curry"
            value={curry}
            onChange={(e) => setCurry(e.target.value)}
            placeholder="Enter curry code..."
            rows="20"
            className="w-full p-4 text-base border border-gray-300 rounded-md resize-none"
          />
        </div>
      </div>
      {/* Compile Button */}
      <div className="text-center mb-6">
        <button
          onClick={handleCompile}
          className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Compile
        </button>
      </div>
      {/* Byte Code Section */}
      <div className="mb-6">
        <label htmlFor="byteCode" className="block mb-2 font-bold text-lg">
          Byte Code
        </label>
        <textarea
          id="byteCode"
          value={byteCode}
          readOnly
          rows="2"
          className="w-full p-4 text-base border border-gray-300 rounded-md bg-gray-100 resize-none"
        />
      </div>
      {/* Puzzle Hash Section */}
      <div>
        <label htmlFor="puzzleHash" className="block mb-2 font-bold text-lg">
          Puzzle Hash
        </label>
        <div className="w-full gap-4">
          <textarea
            id="puzzleHash"
            value={puzzleHash}
            readOnly
            rows="2"
            className="w-full text-base border border-gray-300 rounded-md bg-gray-100 resize-none"
          />
          <button
            onClick={handleCopy}
            className="px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
