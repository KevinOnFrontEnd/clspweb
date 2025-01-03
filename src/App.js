import React, { useState } from "react";
import pkg from "clvm-lib";
import { PlayIcon } from "@heroicons/react/24/solid";
import Parameters from "./components/Parameters";
import Output from "./components/Output";
import Footer from "./components/Footer";

function App() {
  const { Program } = pkg;

  //program
  const [programSource, setProgramSource] = useState("");
  const [programOutput, setProgramOutput] = useState(""); // Output State
  const [compiledProgram, setCompiledProgram] = useState("");
  const [programParameters, setProgramParameters] = useState([]);
  const [programCurriedParameters, setProgramCurriedParameters] = useState([]); // Curried Parameters State
  const [programCost, setProgramCost] = useState(0);

  //outputs
  const [_, setByteCode] = useState(""); //eslint-disable-line no-unused-vars
  const [puzzleHash, setPuzzleHash] = useState("");

  // Deploy modal state
  const [showDeployDialog, setShowDeployDialog] = useState(false);

  const handleCompile = () => {
    try {
      if (programSource !== "") {
        const program = Program.fromSource(programSource);
        let compiledSource = program.compile();

        setPuzzleHash(compiledSource.value.hashHex());

        if (programCurriedParameters.length > 0) {
          const curriedParams = programCurriedParameters.map(
            (param) => param.value,
          );

          //compile source
          compiledSource = program.compile();

          //curry in parameters
          compiledSource = compiledSource.value.curry(curriedParams);
          setCompiledProgram(compiledSource.toString());
        }

        if (programParameters.length > 0) {
          const values = programParameters.map((param) => param.value);
          const params = Program.fromList(values);

          const output = compiledSource.value.run(params);
          setCompiledProgram(compiledSource.value.toString());
          setByteCode(compiledSource.value.toString());
          setProgramOutput(output.value.toString());
          setProgramCost(output.cost);
        } else {
          const output = compiledSource.run();
          setByteCode(compiledSource.toString());
          setProgramOutput(output.value.toString());
          setProgramCost(output.cost);
        }
      } else {
        alert("No chialisp source code!");
      }
    } catch (ex) {
      setProgramOutput(ex.toString());
      setCompiledProgram("");
      setPuzzleHash("");
      setProgramCost(0);
    }
  };

  const handleDeploy = () => {
    setShowDeployDialog(false); // Close the dialog
  };

  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="w-100 text-lg font-bold">clspweb.dev</h1>
          <h2 className="text-sm text-green-300">Simple chialisp editor</h2>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleCompile}
            className="flex items-center px-6 py-2 bg-green-600 rounded-md hover:bg-green-700 transition duration-200 mr-2"
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            Run
          </button>
          <button
            onClick={() => setShowDeployDialog(true)}
            className="flex items-center px-6 py-2 bg-red-600 rounded-md hover:bg-red-700 transition duration-200 disabled"
            disabled
          >
            Deploy
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 flex flex-col">
        {/* Warning Banner */}
        <div className="p-4 mb-6 text-center text-white bg-red-600 rounded-md">
          ⚠️ This is a alpha release and is not fully functional. Use at your
          own risk.
        </div>

        {/* Responsive Flex Container */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex-1 min-w-[300px] pb-4">
            <label htmlFor="source" className="block mb-2 font-bold text-lg">
              Source
            </label>

            {/* Textarea for Source Code */}
            <textarea
              id="source"
              value={programSource}
              onChange={(e) => setProgramSource(e.target.value)}
              placeholder="Enter source code..."
              rows="15"
              className="w-full p-4 text-base border border-gray-300 rounded-md resize-none mb-4"
            />

            {/* Copy Source Link */}
            <div className="text-right">
              <a
                href="#copy"
                onClick={(e) => {
                  e.preventDefault(); // Prevent the default anchor behavior
                  navigator.clipboard.writeText(programSource);
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Copy Source
              </a>
            </div>
          </div>

          <div className="flex-1 min-w-[300px] flex flex-col">
            <Parameters
              setProgramParameters={setProgramParameters}
              setProgramCurriedParameters={setProgramCurriedParameters}
            />
          </div>
        </div>

        <div>
          <Output
            puzzleHash={puzzleHash}
            compiledProgram={compiledProgram}
            output={programOutput}
            programCost={programCost}
          />
        </div>
      </div>
      <Footer />

      {/* Deploy Dialog */}
      {showDeployDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Deploy Contract</h2>
            <p className="mb-6">
              Are you sure you want to deploy this contract?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeployDialog(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeploy}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Deploy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
