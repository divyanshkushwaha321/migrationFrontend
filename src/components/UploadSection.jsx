import React, { useEffect, useRef } from "react";

const UploadSection = ({
  item,
  sectionRef,
  handleFileChange,
  handleUpload,
  loading,
  status,
  fileName,
  disabled,
  sequenceStep,
  clearSignal,
  onClear,
}) => {
  const fileInputRef = useRef(null);
  const currentStatus = status || "idle";
  const isSequenceStep = Number.isInteger(sequenceStep);
  const isLocked = Boolean(disabled && isSequenceStep);
  const statusTextMap = {
    idle: "No file",
    ready: "Ready",
    uploading: "Uploading",
    uploaded: "Uploaded",
    migrating: "Migrating",
    migrated: "Migrated",
    error: "Error",
  };
  const statusText = statusTextMap[currentStatus] || statusTextMap.idle;
  const fileLabel = isLocked
    ? "Locked until previous step is complete."
    : fileName
      ? currentStatus === "uploaded"
        ? `Uploaded: ${fileName}`
        : `Selected: ${fileName}`
      : "No file selected yet.";

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [clearSignal]);

  return (
    <div ref={sectionRef} className="py-3 min-h-[64px] flex items-center">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isSequenceStep && (
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
                  isLocked
                    ? "border-gray-200 text-gray-300 bg-gray-50"
                    : "border-indigo-200 text-indigo-700 bg-indigo-50"
                }`}
                aria-label={
                  isLocked
                    ? "Locked step"
                    : `Step ${sequenceStep}`
                }
              >
                {isLocked ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                ) : (
                  sequenceStep
                )}
              </span>
            )}
            <span className={`status-dot is-${currentStatus}`} />
            <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
          </div>
          <p className="mt-1 text-xs muted-text truncate">{fileLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`status-chip is-${currentStatus}`}>{statusText}</span>
          <input
            type="file"
            accept=".xlsx,.csv,.json"
            disabled={disabled}
            onChange={(e) =>
              handleFileChange(item.endpoint, e.target.files[0])
            }
            ref={fileInputRef}
            className="text-xs muted-text file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
          />

          <button
            onClick={() => handleUpload(item.endpoint)}
            disabled={loading || disabled}
            className="accent-btn px-4 py-2 rounded-md shadow-sm hover:brightness-95 transition text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          {fileName && (
            <button
              onClick={() => onClear(item.endpoint)}
              disabled={loading || disabled}
              className="accent-outline px-4 py-2 rounded-md shadow-sm hover:brightness-95 transition text-sm font-medium disabled:opacity-60"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSection;