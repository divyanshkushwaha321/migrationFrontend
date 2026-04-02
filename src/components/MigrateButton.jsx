import React from "react";

const MigrateButton = ({ onClick, disabled, loading }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-5 py-2 rounded-full accent-btn shadow-sm hover:brightness-95 transition font-medium disabled:opacity-60"
      >
        {loading ? "Migrating..." : "Migrate Data"}
      </button>
    </div>
  );
};

export default MigrateButton;