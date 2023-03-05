import React from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingSkeleton = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="animate-spin text-white">
        <FaSpinner className="text-6xl" />
      </div>
      <h1 className="text-2xl font-semibold">Loading...</h1>
    </div>
  );
};

export default LoadingSkeleton;
