import React, { useState, useRef } from "react";
import UploadSection from "../components/UploadSection";
import MigrateButton from "../components/MigrateButton";
import ConfirmModal from "../components/ConfirmModal";
import { uploads } from "../config/uploadConfig";

const UploadDashboard = () => {
  const [files, setFiles] = useState({});
  const [uploadMeta, setUploadMeta] = useState({});
  const [loading, setLoading] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearSignals, setClearSignals] = useState({});
  const toastTimer = useRef(null);
  const sectionRefs = useRef({});

  const statusTextMap = {
    idle: "No file",
    ready: "Ready",
    uploading: "Uploading",
    uploaded: "Uploaded",
    migrating: "Migrating",
    migrated: "Migrated",
    error: "Error",
  };

  const updateMeta = (endpoint, updates) => {
    setUploadMeta((prev) => ({
      ...prev,
      [endpoint]: {
        ...(prev[endpoint] || {}),
        ...updates,
      },
    }));
  };

  const showToast = (message) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    setToast({ message });
    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const sequenceSteps = {
    landlords: 1,
    client: 2,
    property: 3,
  };

  const isSectionEnabled = (endpoint) => {
    const landlordStatus = uploadMeta.landlords?.status;
    const clientStatus = uploadMeta.client?.status;

    if (endpoint === "client") {
      return landlordStatus === "migrated";
    }

    if (endpoint === "property") {
      return clientStatus === "migrated";
    }

    return true;
  };

  const handleFileChange = (endpoint, file) => {
    if (!file) {
      setFiles((prev) => ({ ...prev, [endpoint]: null }));
      updateMeta(endpoint, { status: "idle", fileName: "" });
      return;
    }

    if (!isSectionEnabled(endpoint)) {
      showToast("Please complete the previous migration step first.");
      return;
    }

    const fileName = file.name.toLowerCase();
    const expectedFileName = endpoint.toLowerCase();
    const allowedExtensions = [".xlsx", ".csv", ".json"];

    const isValid = allowedExtensions.some((ext) => {
      return fileName === `${expectedFileName}${ext}`;
    });

    if (!isValid) {
      alert(
        `Wrong file name for this section. Please upload a file named '${expectedFileName}.xlsx', '${expectedFileName}.csv', or '${expectedFileName}.json'.`
      );
      // Clear the file input if the file is invalid
      const input = document.querySelector(`input[type="file"]`);
      if (input) {
        input.value = "";
      }
      setFiles((prev) => ({ ...prev, [endpoint]: null }));
      updateMeta(endpoint, { status: "idle", fileName: "" });
      return;
    }

    setFiles((prev) => ({ ...prev, [endpoint]: file }));
    updateMeta(endpoint, { status: "ready", fileName: file.name });
  };

  const handleClearFile = (endpoint) => {
    setFiles((prev) => ({ ...prev, [endpoint]: null }));
    updateMeta(endpoint, { status: "idle", fileName: "" });
    setClearSignals((prev) => ({
      ...prev,
      [endpoint]: (prev[endpoint] || 0) + 1,
    }));
    showToast("File selection cleared.");
  };

  //  PUT handleUpload HERE
  const handleUpload = async (endpoint) => {
    if (!isSectionEnabled(endpoint)) {
      showToast("Please complete the previous migration step first.");
      return;
    }
    const file = files[endpoint];
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    updateMeta(endpoint, { status: "uploaded", fileName: file.name });
    showToast("File staged for migration.");
  };

  const handleMigrate = async () => {

    const entries = uploads
      .map((item) => ({
        item,
        file: files[item.endpoint],
        meta: uploadMeta[item.endpoint],
      }))
      .filter(({ file, meta }) => file && meta?.status === "uploaded");

    if (entries.length === 0) {
      showToast("Select and upload files before migrating.");
      return;
    }

    entries.forEach(({ item }) => {
      setLoading((prev) => ({ ...prev, [item.endpoint]: true }));
      updateMeta(item.endpoint, { status: "migrating" });
    });

    const results = await Promise.allSettled(
      entries.map(({ item, file }) => {
        const formData = new FormData();
        formData.append("excelFilePath", file);

        return fetch(`http://localhost:5600/api/${item.endpoint}`, {
          method: "POST",
          body: formData,
        })
          .then(async (res) => {
            if (!res.ok) {
              throw new Error(`Server responded with ${res.status}`);
            }

            let data = null;
            try {
              data = await res.json();
            } catch (error) {
              data = null;
            }

            console.log(`Response from ${item.endpoint}:`, data);
            return {
              endpoint: item.endpoint,
              data,
              httpStatus: res.status,
            };
          });
      })
    );

    const succeeded = [];
    const failed = [];
    const pending = [];

    results.forEach((result, index) => {
      const endpoint = entries[index].item.endpoint;
      if (result.status === "fulfilled") {
        const message = String(result.value?.data?.message || "").toLowerCase();
        const statusFlag = String(result.value?.data?.status || "").toLowerCase();
        const httpStatus = result.value?.httpStatus;
        const isSuccess =
          httpStatus === 200 ||
          (statusFlag === "1" && message.includes("data processed successfully"));
        console.log("Migration check", {
          endpoint,
          message,
          statusFlag,
          httpStatus,
          isSuccess,
        });

        if (isSuccess) {
          succeeded.push(endpoint);
        } else {
          pending.push(endpoint);
        }
      } else {
        failed.push(endpoint);
      }
    });

    succeeded.forEach((endpoint) => {
      updateMeta(endpoint, { status: "migrated" });
      setLoading((prev) => ({ ...prev, [endpoint]: false }));
    });

    pending.forEach((endpoint) => {
      updateMeta(endpoint, { status: "migrating" });
      setLoading((prev) => ({ ...prev, [endpoint]: false }));
    });

    failed.forEach((endpoint) => {
      updateMeta(endpoint, { status: "error" });
      setLoading((prev) => ({ ...prev, [endpoint]: false }));
    });

    if (succeeded.length > 0) {
      const successMessage =
        succeeded.length === 1
          ? "File has been migrated successfully."
          : `${succeeded.length} files have been migrated successfully.`;
      showToast(successMessage);
    }
  };

  const handleMigrateClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmMigrate = () => {
    setConfirmOpen(false);
    handleMigrate();
  };

  const scrollToSection = (endpoint) => {
    const element = sectionRefs.current[endpoint];
    if (!element) return;

    window.scrollTo({
      top: element.offsetTop - 80,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-10 pb-24">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[0.12em] uppercase text-gray-900">
            Wolverine Property Management
          </h1>
          <p className="mt-2 text-sm muted-text">
            WPSL • Upload Center
          </p>
        </header>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,740px)_minmax(260px,340px)] items-start">
          <section className="glass-panel p-6 lg:h-[calc(100vh-140px)] lg:overflow-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-[0.2em] uppercase muted-text">
                  Upload Sheets
                </h2>
                <p className="mt-1 text-xs muted-text">
                  {uploads.length} files • list view
                </p>
              </div>
              <span className="status-chip is-ready">Active</span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs text-amber-800">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Data Dependency Notice
                </p>
                <p className="mt-1">
                  Upload in the order shown below. Next steps unlock only after
                  the current step is migrated.
                </p>
              </div>

              {uploads.map((item) => {
                const meta = uploadMeta[item.endpoint] || {};
                const isDisabled = !isSectionEnabled(item.endpoint);
                const sequenceStep = sequenceSteps[item.endpoint];
                return (
                  <UploadSection
                    key={item.endpoint}
                    item={item}
                    sectionRef={(el) => (sectionRefs.current[item.endpoint] = el)}
                    handleFileChange={handleFileChange}
                    handleUpload={handleUpload}
                    loading={loading[item.endpoint]}
                    status={meta.status}
                    fileName={meta.fileName}
                    disabled={isDisabled}
                    sequenceStep={sequenceStep}
                    clearSignal={clearSignals[item.endpoint]}
                    onClear={handleClearFile}
                  />
                );
              })}
            </div>
          </section>

          <aside className="glass-panel p-6 lg:sticky lg:top-24 lg:h-[calc(100vh-140px)] lg:overflow-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-[0.18em] uppercase muted-text">
                Upload Status
              </h3>
              <span className="text-xs muted-text">Live</span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {uploads.map((item) => {
                const meta = uploadMeta[item.endpoint] || {};
                const status = meta.status || "idle";
                const fileName = meta.fileName || "No file selected";
                const statusText = statusTextMap[status] || statusTextMap.idle;

                return (
                  <div
                    key={item.endpoint}
                    className="flex items-center gap-3 min-h-[64px]"
                  >
                    <span className={`status-dot is-${status}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-xs muted-text truncate">{fileName}</p>
                    </div>
                    <span className={`status-chip is-${status}`}>
                      {statusText}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <div className="toast-title">Upload</div>
          <div className="text-sm muted-text">{toast.message}</div>
        </div>
      )}

      <MigrateButton
        onClick={handleMigrateClick}
        loading={Object.values(loading).some(Boolean)}
        disabled={Object.values(loading).some(Boolean)}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Confirm Migration"
        message="Are you sure you want to migrate the uploaded data?"
        confirmText="Yes, migrate"
        cancelText="Cancel"
        onConfirm={handleConfirmMigrate}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default UploadDashboard;