import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden mt-4">
      <div
        className="h-full bg-green-500 transition-width duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
