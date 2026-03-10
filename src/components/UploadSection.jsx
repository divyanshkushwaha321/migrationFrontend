import React from "react";

const UploadSection = ({
  item,
  sectionRef,
  handleFileChange,
  handleUpload,
  loading,
  status,
}) => {
  return (
    <div
      ref={sectionRef}
      className="w-[550px] max-w-full bg-white rounded-xl shadow-lg border p-8"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-5">
        {item.title}
      </h2>

      <div className="flex items-center gap-6">
        <input
          type="file"
          accept=".xlsx,.csv,.json"
          onChange={(e) =>
            handleFileChange(item.endpoint, e.target.files[0])
          }
          className="text-sm text-gray-600
          file:mr-4 file:py-3 file:px-5
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-100 file:text-blue-700
          hover:file:bg-blue-200"
        />

        <button
          onClick={() => handleUpload(item.endpoint)}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {status && (
        <p className="mt-4 text-sm text-gray-500">{status}</p>
      )}
    </div>
  );
};

export default UploadSection;