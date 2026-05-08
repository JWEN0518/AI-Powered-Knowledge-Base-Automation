const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const KnowledgeBase = require("../models/KnowledgeBase");
const extractTextFromFile = require("../utils/fileExtractor");

const uploadsDir = path.join(__dirname, "..", "uploads");

function parseTags(tags) {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function toUserInfo(user) {
  return {
    name: user.name,
    email: user.email,
    role: user.role
  };
}

function sanitizeFileName(fileName) {
  const extension = path.extname(fileName);
  const baseName = path
    .basename(fileName, extension)
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  return `${baseName || "upload"}${extension.toLowerCase()}`;
}

function saveUploadedFile(file) {
  if (!file) return null;

  fs.mkdirSync(uploadsDir, { recursive: true });

  const safeOriginalName = sanitizeFileName(file.originalname);
  const uniquePrefix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const storedName = `${uniquePrefix}-${safeOriginalName}`;
  const storedPath = path.join(uploadsDir, storedName);

  fs.writeFileSync(storedPath, file.buffer);

  return {
    originalName: file.originalname,
    storedName,
    url: `/uploads/${storedName}`,
    mimeType: file.mimetype,
    size: file.size
  };
}

function addVersion(record, updatedBy) {
  record.versions.push({
    versionNo: record.versions.length + 1,
    title: record.title,
    content: record.content,
    category: record.category,
    tags: record.tags,
    sourceFile: record.sourceFile,
    uploadedFile: record.uploadedFile,
    status: record.status,
    updatedBy
  });
}

async function listRecords(req, res) {
  try {
    const { search, status, tag, creator, dateFrom, dateTo } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { sourceFile: { $regex: search, $options: "i" } },
        { "uploadedFile.originalName": { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }
      ];
    }

    if (status) query.status = status;
    if (tag) query.tags = { $regex: tag, $options: "i" };
    if (creator) query["creator.email"] = { $regex: creator, $options: "i" };

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    const records = await KnowledgeBase.find(query).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch records",
      error: error.message
    });
  }
}

async function createRecord(req, res) {
  try {
    const { title, content, category, tags, sourceFile } = req.body;

    let finalContent = content || "";
    let finalSourceFile = sourceFile || "";
    let sourceType = "text";
    let uploadedFile = null;

    if (req.file) {
      const extracted = await extractTextFromFile(req.file);
      uploadedFile = saveUploadedFile(req.file);
      finalContent = extracted.text || finalContent || `Uploaded file saved: ${req.file.originalname}`;
      finalSourceFile = req.file.originalname;
      sourceType = extracted.sourceType;
    }

    if (!title || !finalContent) {
      return res.status(400).json({
        message: "Title and content are required. Upload a supported file or enter content manually."
      });
    }

    const creator = toUserInfo(req.user);
    const parsedTags = parseTags(tags);
    const recordCategory = category || "Auto Imported";

    const newRecord = await KnowledgeBase.create({
      title,
      content: finalContent,
      category: recordCategory,
      tags: parsedTags,
      sourceFile: finalSourceFile,
      sourceType,
      uploadedFile,
      status: "Draft",
      creator,
      statusHistory: [
        {
          status: "Draft",
          changedBy: creator,
          note: "Record created by editor"
        }
      ],
      versions: [
        {
          versionNo: 1,
          title,
          content: finalContent,
          category: recordCategory,
          tags: parsedTags,
          sourceFile: finalSourceFile,
          uploadedFile,
          status: "Draft",
          updatedBy: creator
        }
      ]
    });

    res.status(201).json({
      message: "Knowledge base record created successfully",
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create record",
      error: error.message
    });
  }
}

async function updateRecord(req, res) {
  try {
    const { title, content, category, tags, sourceFile } = req.body;
    const record = await KnowledgeBase.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        message: "Record not found"
      });
    }

    if (title !== undefined) record.title = title;
    if (content !== undefined) record.content = content;
    if (category !== undefined) record.category = category;
    if (sourceFile !== undefined) record.sourceFile = sourceFile;
    if (tags !== undefined) record.tags = parseTags(tags);

    if (req.file) {
      const extracted = await extractTextFromFile(req.file);
      record.uploadedFile = saveUploadedFile(req.file);
      record.content = extracted.text || record.content || `Uploaded file saved: ${req.file.originalname}`;
      record.sourceFile = req.file.originalname;
      record.sourceType = extracted.sourceType;
    }

    const updater = toUserInfo(req.user);
    addVersion(record, updater);
    await record.save();

    res.json({
      message: "Knowledge base record updated successfully",
      data: record
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update record",
      error: error.message
    });
  }
}

async function updateStatus(req, res) {
  try {
    const { status, note } = req.body;
    const allowedStatuses = ["Reviewed", "Published"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Reviewer can only update status to Reviewed or Published."
      });
    }

    const record = await KnowledgeBase.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        message: "Record not found"
      });
    }

    if (record.status === "Draft" && status !== "Reviewed") {
      return res.status(400).json({
        message: "Draft records must be marked Reviewed before Published."
      });
    }

    if (record.status === "Published") {
      return res.status(400).json({
        message: "Published records cannot be changed using review action."
      });
    }

    const changer = toUserInfo(req.user);
    record.status = status;
    record.statusHistory.push({
      status,
      changedBy: changer,
      note: note || `Status changed to ${status}`
    });

    addVersion(record, changer);
    await record.save();

    res.json({
      message: "Status updated successfully",
      data: record
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update status",
      error: error.message
    });
  }
}

async function deleteRecord(req, res) {
  try {
    const deletedRecord = await KnowledgeBase.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({
        message: "Record not found"
      });
    }

    res.json({
      message: "Record deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete record",
      error: error.message
    });
  }
}

module.exports = {
  listRecords,
  createRecord,
  updateRecord,
  updateStatus,
  deleteRecord
};
