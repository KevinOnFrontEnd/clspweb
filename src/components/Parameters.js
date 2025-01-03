import React, { useState } from "react";
import pkg from "clvm-lib";
import { XCircleIcon } from "@heroicons/react/24/solid";

function Parameters({ setProgramParameters, setProgramCurriedParameters }) {
  const [parameterType, setParameterType] = useState("Int");
  const [parameterValue, setParameterValue] = useState("");
  const [parameters, setParameters] = useState([]);
  const [curriedParameters, setCurriedParameters] = useState([]); // Curried Parameters State
  const [activeTab, setActiveTab] = useState("parameters"); // Tab State
  const { Program } = pkg;

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

      //let parent know of state changes
      setProgramCurriedParameters([...curriedParameters, newParameter]);
    } else {
      setParameters([...parameters, newParameter]);

      //let parent know of state changes
      setProgramParameters([...parameters, newParameter]);
    }

    setParameterValue(""); // Reset input field
  };

  const handleRemoveParameter = (index, isCurried) => {
    if (isCurried) {
      setCurriedParameters(curriedParameters.filter((_, i) => i !== index));

      //let parent know of state changes
      setProgramCurriedParameters(
        curriedParameters.filter((_, i) => i !== index),
      );
      setProgramCurriedParameters();
    } else {
      setParameters(parameters.filter((_, i) => i !== index));

      //let parent know of state changes
      setProgramParameters(parameters.filter((_, i) => i !== index));
    }
  };

  return (
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
          onClick={() => handleAddParameter(activeTab === "curriedParameters")}
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
              (activeTab === "parameters" ? parameters : curriedParameters).map(
                (param, index) => (
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
                ),
              )
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500 italic"
                >
                  No {activeTab === "parameters" ? "" : "curried"} parameters
                  added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Parameters;
