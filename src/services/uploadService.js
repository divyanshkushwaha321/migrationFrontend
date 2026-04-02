export const uploadLandlordFile = async (excelFilePath) => {
  const res = await fetch("http://localhost:5600/api/landlord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ excelFilePath }),
  });

  return res.json();
};