// import { useState, useRef } from "react";

// export default function App() {
//   const uploads = [
//     { title: "Property Data", endpoint: "property" },
//     { title: "Landlord Data", endpoint: "landlord" },
//     { title: "Client Data", endpoint: "client" },
//     { title: "Contractor Data", endpoint: "contractor" },
//     { title: "Rent Data", endpoint: "rent" },
//     { title: "Receipt Data", endpoint: "receipt" },
//     { title: "Certificate Data", endpoint: "certificate" },
//     { title: "Cert Email Data", endpoint: "cert-email" },
//     { title: "Deposit Data", endpoint: "deposit" },
//   ];

//   const [files, setFiles] = useState({});
//   const [status, setStatus] = useState({});
//   const [loading, setLoading] = useState({});

//   const sectionRefs = useRef({});
  
//   const handleFileChange = (key, file) => {
//     setFiles((prev) => ({ ...prev, [key]: file }));
//   };

//   const handleUpload = async (endpoint) => {
//     const file = files[endpoint];

//     if (!file) {
//       setStatus((prev) => ({
//         ...prev,
//         [endpoint]: "Please select a file",
//       }));
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading((prev) => ({ ...prev, [endpoint]: true }));
//       setStatus((prev) => ({ ...prev, [endpoint]: "Uploading..." }));

//       const res = await fetch(`http://localhost:5000/api/upload/${endpoint}`, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       setStatus((prev) => ({
//         ...prev,
//         [endpoint]: data.message || "Upload successful",
//       }));
//     } catch (error) {
//       setStatus((prev) => ({
//         ...prev,
//         [endpoint]: "Upload failed",
//       }));
//     } finally {
//       setLoading((prev) => ({ ...prev, [endpoint]: false }));
//     }
//   };

//   const scrollToSection = (endpoint) => {
//     const element = sectionRefs.current[endpoint];
//     if (!element) return;

//     const navbarHeight = 80; // adjust if navbar height changes

//     const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;

//     const offsetPosition = elementPosition - navbarHeight;

//     window.scrollTo({
//       top: offsetPosition,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">

//       {/* Navbar */}
//       <nav className="sticky top-0 bg-white shadow-md z-10">
//         <div className="flex flex-wrap gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 justify-center">
//           {uploads.map((item) => (
//             <button
//               key={item.endpoint}
//               onClick={() => scrollToSection(item.endpoint)}
//               className="px-4 py-2 border border-gray-300 rounded-lg 
//               text-gray-700 font-medium 
//               hover:bg-blue-600 hover:text-white hover:border-blue-600
//               transition duration-200"
//             >
//               {item.title}
//             </button>
//           ))}
//         </div>
//       </nav>
      
//       {/* Sections */}
//       <div className="flex flex-col items-center sm:items-start px-4 sm:pl-10 gap-8 pt-10 pb-20">
//         {uploads.map((item) => (
//           <div
//             key={item.endpoint}
//             ref={(el) => (sectionRefs.current[item.endpoint] = el)}
//             className="w-full sm:w-[550px] max-w-[95%] bg-white rounded-xl shadow-lg border p-6 sm:p-8"
//           >
//             <h2 className="text-xl font-semibold text-gray-700 mb-5">
//               {item.title}
//             </h2>

//             <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
//               <input
//                 type="file"
//                 accept=".xlsx,.csv,.json"
//                 onChange={(e) =>
//                   handleFileChange(item.endpoint, e.target.files[0])
//                 }
//                 className="flex-1 text-sm text-gray-600
//                 file:mr-4 file:py-3 file:px-5
//                 file:rounded-lg file:border-0
//                 file:text-sm file:font-semibold
//                 file:bg-blue-100 file:text-blue-700
//                 hover:file:bg-blue-200"
//               />

//               <button
//                 onClick={() => handleUpload(item.endpoint)}
//                 disabled={loading[item.endpoint]}
//                 className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
//               >
//                 {loading[item.endpoint] ? "Uploading..." : "Upload"}
//               </button>
//             </div>

//             {status[item.endpoint] && (
//               <p className="mt-4 text-sm text-gray-500">
//                 {status[item.endpoint]}
//               </p>
//             )}
//           </div>
//         ))}
//       </div>

//         {/* {Object.values(status).some((s) =>
//           s?.toLowerCase().includes("success")
//         ) && (
//           <div className="fixed bottom-6 right-6 z-50">
//             <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg 
//             hover:bg-green-700 transition duration-200 font-semibold">
//               Migrate Data
//             </button>
//           </div>
//         )} */}

//         <div className="fixed bottom-6 right-6 z-50">
//             <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg 
//             hover:bg-green-700 transition duration-200 font-semibold">
//               Migrate Data
//             </button>
//         </div>

//     </div>
//   );
// }


import UploadDashboard from "./pages/UploadDashboard";

export default function App() {
  return <UploadDashboard />;
}