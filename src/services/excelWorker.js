import * as XLSX from "xlsx";

// Improved header formatting: "truckNumber" -> "Truck Number"
const formatHeader = (header) => {
  return header
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
};

onmessage = function (e) {
  try {
    const {
      data: allData,
      companyName = "Your Company Name",
      dateLabel = "Fetched Date",
    } = e.data || {};
    if (!Array.isArray(allData) || allData.length === 0) {
      postMessage({ error: "No data provided" });
      return;
    }

    const rawHeaders = Object.keys(allData[0]);
    const headers = rawHeaders.map(formatHeader);

    const worksheet = XLSX.utils.json_to_sheet(allData, { header: rawHeaders });

    // Add custom rows for company name and date
    XLSX.utils.sheet_add_aoa(worksheet, [[companyName]], { origin: "A1" });
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`${dateLabel}: ${new Date().toLocaleDateString()}`]],
      { origin: "A2" }
    );

    // Add formatted headers to the third row (index 2) of the worksheet
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A3" });

    // Apply bold style to headers
    headers.forEach((_, index) => {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 2, c: index })]; // Index 2 for headers
      if (cell) {
        cell.s = { font: { bold: true } };
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate Excel file and create a blob
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    postMessage(blob); // Send the blob back to the main thread
  } catch (err) {
    postMessage({ error: err.message || "Excel export failed" });
  }
};
