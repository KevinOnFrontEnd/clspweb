import React, { useState } from "react";
import pkg from "clvm-lib";
import { PlayIcon } from "@heroicons/react/24/solid";

function App() {
  const [source, setSource] = useState("");

  const [byteCode, setByteCode] = useState("");
  const [puzzleHash, setPuzzleHash] = useState("");
  const [parameterType, setParameterType] = useState("Int");
  const [parameterValue, setParameterValue] = useState("");
  const [parameters, setParameters] = useState([]);
  // const [curry, setCurry] = useState("");
  const { Program } = pkg;

  const handleCompile = () => {
    if (source !== "") {
      const program = Program.fromSource(source);
      const compiledSource = program.compile();

      if (parameters.length > 0) {
        const params = Program.fromList(parameters);
        var output = compiledSource.value.run(params);
        setByteCode(output.value.toString());
      } else {
        var out = compiledSource.value.run();

        setByteCode(out.value.toString());
      }

      setPuzzleHash(compiledSource.value.toHex());
    } else {
      alert("No chialisp source code!");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(puzzleHash).then(() => {
      alert("Puzzle Hash copied to clipboard!");
    });
  };

  const handleAddParameter = () => {
    let newParameter = {};

    console.log(parameterValue);
    //text
    if (parameterType === "Text") {
      newParameter = Program.fromText(parameterValue);
    } else if (parameterType === "BigInt") {
      //const val = BigInt(parameterValue);
      //newParameter = Program.fromBigInt(parameterValue);
    } else if (parameterType === "Int") {
      const val = parseInt(parameterValue);
      newParameter = Program.fromInt(val);
    }

    setParameters([...parameters, newParameter]);
  };

  return (
    <div className="p-6 font-sans">
      {/* Warning Banner */}
      <div className="p-4 mb-6 text-center text-white bg-red-600 rounded-md">
        ⚠️ This is a pre-alpha release and is not fully functional. Use at your
        own risk.
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
      </div>

      {/* Parameters Section */}
      <div className="mb-6">
        <label htmlFor="parameters" className="block mb-2 font-bold text-lg">
          Parameters
        </label>
        <div className="flex items-center gap-4">
          <select
            value={parameterType}
            onChange={(e) => setParameterType(e.target.value)}
            className="p-2 text-base border border-gray-300 rounded-md"
          >
            <option value="Int">Int</option>
            <option value="Text">Text</option>
          </select>
          <input
            type="text"
            value={parameterValue}
            onChange={(e) => setParameterValue(e.target.value)}
            placeholder="Enter value"
            className="flex-1 p-2 text-base border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddParameter}
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add
          </button>
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
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition duration-200">
          <PlayIcon className="w-5 h-5 mr-2" />
          Run
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
