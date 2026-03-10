import React from "react";

const MigrateButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg
        hover:bg-green-700 transition font-semibold"
      >
        Migrate Data
      </button>
    </div>
  );
};

export default MigrateButton;