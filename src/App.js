import React, { useState } from "react";
import pkg from "clvm-lib";
import { PlayIcon, XCircleIcon } from "@heroicons/react/24/solid";

function App() {
  const [source, setSource] = useState("");
  const [_, setByteCode] = useState(""); //eslint-disable-line no-unused-vars
  const [puzzleHash, setPuzzleHash] = useState("");
  const [parameterType, setParameterType] = useState("Int");
  const [parameterValue, setParameterValue] = useState("");
  const [parameters, setParameters] = useState([]);
  const [curriedParameters, setCurriedParameters] = useState([]); // Curried Parameters State
  const [activeTab, setActiveTab] = useState("parameters"); // Tab State
  const [output, setOutput] = useState(""); // Output State
  const [compiledProgram, setCompiledProgram] = useState("");
  const { Program } = pkg;

  const handleCompile = () => {
    if (source !== "") {
      const program = Program.fromSource(source);
      let compiledSource = program.compile();

      setPuzzleHash(compiledSource.value.hashHex());

      if (curriedParameters.length > 0) {
        const curriedParams = curriedParameters.map((param) => param.value);

        //compile source
        compiledSource = program.compile();

        //curry in parameters
        compiledSource = compiledSource.value.curry(curriedParams);
        setCompiledProgram(compiledSource.toString());
      }

      if (parameters.length > 0) {
        const values = parameters.map((param) => param.value);
        const params = Program.fromList(values);

        const output = compiledSource.value.run(params);
        setByteCode(compiledSource.value.toString());
        setOutput(output.value.toString());
      } else {
        const output = compiledSource.run();
        setByteCode(compiledSource.toString());
        setOutput(output.value.toString());
      }
    } else {
      alert("No chialisp source code!");
    }
  };

  const handleAddParameter = (isCurried) => {
    let newParameter = {};
    if (parameterType === "Text") {
      newParameter = { type: "Text", value: Program.fromText(parameterValue) };
    } else if (parameterType === "Int") {
      const val = parseInt(parameterValue);
      if (isNaN(val)) return; //don't add the parameter if it's not a number
      newParameter = { type: "Int", value: Program.fromInt(val) };
    }

    if (isCurried) {
      setCurriedParameters([...curriedParameters, newParameter]);
    } else {
      setParameters([...parameters, newParameter]);
    }

    setParameterValue(""); // Reset input field
  };

  const handleRemoveParameter = (index, isCurried) => {
    if (isCurried) {
      setCurriedParameters(curriedParameters.filter((_, i) => i !== index));
    } else {
      setParameters(parameters.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-bold">Chialisp Editor</h1>
        <button
          onClick={handleCompile}
          className="flex items-center px-6 py-2 bg-green-600 rounded-md hover:bg-green-700 transition duration-200"
        >
          <PlayIcon className="w-5 h-5 mr-2" />
          Run
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 flex flex-col">
        {/* Warning Banner */}
        <div className="p-4 mb-6 text-center text-white bg-red-600 rounded-md">
          ⚠️ This is a pre-alpha release and is not fully functional. Use at
          your own risk.
        </div>

        {/* Responsive Flex Container */}
        <div className="flex flex-wrap gap-6 mb-6">
          {/* Source Section */}
          <div className="flex-1 min-w-[300px]">
            <label htmlFor="source" className="block mb-2 font-bold text-lg">
              Source
            </label>
            <textarea
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter source code..."
              rows="10"
              className="w-full p-4 text-base border border-gray-300 rounded-md resize-none"
            />
          </div>

          {/* Parameters Section with Tabs */}
          <div className="flex-1 min-w-[300px] flex flex-col">
            <div>
              <label htmlFor="source" className="block mb-2 font-bold text-lg">
                Parameters
              </label>
              <div className="border-b border-gray-300 flex mb-4">
                <button
                  onClick={() => setActiveTab("parameters")}
                  className={`flex-1 p-2 text-center ${
                    activeTab === "parameters"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Parameters
                </button>
                <button
                  onClick={() => setActiveTab("curriedParameters")}
                  className={`flex-1 p-2 text-center ${
                    activeTab === "curriedParameters"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Curried Parameters
                </button>
              </div>
            </div>

            {/* Form for Adding Parameters */}
            <div className="flex items-center gap-4 mb-4">
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
                onClick={() =>
                  handleAddParameter(activeTab === "curriedParameters")
                }
                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {/* Parameters or Curried Parameters Table */}
            <div className="flex-grow overflow-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Type</th>
                    <th className="border border-gray-300 px-4 py-2">Value</th>
                    <th className="border border-gray-300 px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === "parameters" ? parameters : curriedParameters)
                    .length > 0 ? (
                    (activeTab === "parameters"
                      ? parameters
                      : curriedParameters
                    ).map((param, index) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">
                          {param.type}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {param.value.toString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() =>
                              handleRemoveParameter(
                                index,
                                activeTab === "curriedParameters",
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <XCircleIcon className="w-5 h-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="border border-gray-300 px-4 py-2 text-center text-gray-500 italic"
                      >
                        No {activeTab === "parameters" ? "" : "curried"}{" "}
                        parameters added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-grow bg-black text-white rounded-md overflow-auto p-4">
          <h2 className="text-lg font-bold text-gray-400 mb-4">Output</h2>
          <div className="whitespace-pre-wrap text-sm">
            {output || "No output yet."}
            <br />
            Puzzlehash: {puzzleHash || ""}
            <br />
            Compiled Program: {compiledProgram || ""}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center mt-6">
        <p className="text-sm">Version 0.0.1</p>
        <a
          href="https://github.com/KevinOnFrontEnd/clspweb"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-500"
        >
          GitHub Repository
        </a>
      </footer>
    </div>
  );
}

export default App;
