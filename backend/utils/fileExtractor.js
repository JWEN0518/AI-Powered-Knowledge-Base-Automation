const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

async function extractTextFromFile(file) {
  const fileName = file.originalname.toLowerCase();

  if (fileName.endsWith(".txt")) {
    return {
      text: file.buffer.toString("utf-8"),
      sourceType: "txt"
    };
  }

  if (fileName.endsWith(".docx")) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer
    });

    return {
      text: result.value || "",
      sourceType: "docx"
    };
  }

  if (fileName.endsWith(".pdf")) {
    const result = await pdfParse(file.buffer);

    return {
      text: result.text || "",
      sourceType: "pdf"
    };
  }

  return {
    text: "",
    sourceType: "unknown"
  };
}

module.exports = extractTextFromFile;
