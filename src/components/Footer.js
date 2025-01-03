import React from "react";

const Footer = ({ puzzleHash, compiledProgram, output }) => {
  return (
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
      <div className="mt-4">
        <a
          href="https://x.com/KevinOnFrontend"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-500 flex items-center justify-center"
        >
          <span>Follow on X</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
