function cleanJsonText(text) {
  return text
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();
}

function formatAiContent(aiDraft) {
  const stepsText = Array.isArray(aiDraft.steps)
    ? aiDraft.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")
    : "";

  return `Summary:
${aiDraft.summary || ""}

Step-by-Step Procedure:
${stepsText}

Quality Notes:
${aiDraft.qualityNotes || ""}

Conflict Warning:
${aiDraft.conflictWarning || ""}

Outdated Warning:
${aiDraft.outdatedWarning || ""}`;
}

async function buildAiDraft({ rawText, sourceFile, existingRecords }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in .env");
  }

  const { GoogleGenAI } = await import("@google/genai");

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const existingArticleSummary = existingRecords
    .map((record, index) => {
      return `${index + 1}. Title: ${record.title}
Tags: ${(record.tags || []).join(", ")}
Content Preview: ${(record.content || "").slice(0, 500)}`;
    })
    .join("\n\n");

  const prompt = `
You are an AI assistant for DHL Logistics Knowledge Base automation.

Transform the raw content created by UiPath into a clean knowledge base article.

Return ONLY valid JSON with this exact structure:
{
  "title": "",
  "summary": "",
  "steps": [],
  "tags": [],
  "category": "",
  "qualityNotes": "",
  "conflictWarning": "",
  "outdatedWarning": ""
}

Rules:
- title should be short and clear.
- summary should explain the main purpose of the article.
- steps should be clear step-by-step procedures.
- tags should contain 3 to 6 useful search tags.
- category should be one short category such as SOP, Delivery, Invoice, System Error, Customer Support, or General.
- qualityNotes should mention missing or unclear information.
- conflictWarning should mention if this content conflicts with existing published articles.
- outdatedWarning should mention if the content seems outdated or incomplete.
- Do not invent DHL policy.
- Use professional knowledge base writing style.

Source file:
${sourceFile || "UiPath imported file"}

Raw content from UiPath:
${rawText.slice(0, 12000)}

Existing published articles:
${existingArticleSummary || "No existing published articles found."}
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: prompt
  });

  const text = cleanJsonText(response.text || "");
  const aiDraft = JSON.parse(text);

  return {
    ...aiDraft,
    polishedContent: formatAiContent(aiDraft)
  };
}

module.exports = buildAiDraft;