import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import UploadSection from "../components/UploadSection";
import MigrateButton from "../components/MigrateButton";
import { uploads } from "../config/uploadConfig";

const UploadDashboard = () => {

  const [files, setFiles] = useState({});
  const sectionRefs = useRef({});

  const handleFileChange = (endpoint, file) => {
    if (!file) {
      setFiles((prev) => ({ ...prev, [endpoint]: null }));
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
        `Invalid file name. For this section, please upload a file named '${expectedFileName}.xlsx', '${expectedFileName}.csv', or '${expectedFileName}.json'.`
      );
      // Clear the file input if the file is invalid
      const input = document.querySelector(`input[type="file"]`);
      if (input) {
        input.value = "";
      }
      setFiles((prev) => ({ ...prev, [endpoint]: null }));
      return;
    }

    setFiles((prev) => ({ ...prev, [endpoint]: file }));
  };

  //  PUT handleUpload HERE
  const handleUpload = async (endpoint) => {
    const file = files[endpoint];
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("excelFilePath", file);

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      console.log(data);
      alert(`${file.name} uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. See console for details.");
    }
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
    <div className="min-h-screen bg-gray-100">

      <Navbar uploads={uploads} scrollToSection={scrollToSection} />

      <div className="flex flex-col gap-8 pt-10 pb-20 pl-10">

        {uploads.map((item) => (
          <UploadSection
            key={item.endpoint}
            item={item}
            sectionRef={(el) => (sectionRefs.current[item.endpoint] = el)}
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
          />
        ))}

      </div>

      <MigrateButton />

    </div>
  );
};

export default UploadDashboard;