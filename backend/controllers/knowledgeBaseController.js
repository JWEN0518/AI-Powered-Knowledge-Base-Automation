const KnowledgeBase = require("../models/KnowledgeBase");
const extractTextFromFile = require("../utils/fileExtractor");

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

function addVersion(record, updatedBy) {
  record.versions.push({
    versionNo: record.versions.length + 1,
    title: record.title,
    content: record.content,
    category: record.category,
    tags: record.tags,
    sourceFile: record.sourceFile,
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

    if (req.file) {
      const extracted = await extractTextFromFile(req.file);
      finalContent = extracted.text || finalContent;
      finalSourceFile = req.file.originalname;
      sourceType = extracted.sourceType;
    }

    if (!title || !finalContent) {
      return res.status(400).json({
        message: "Title and content are required."
      });
    }

    const creator = toUserInfo(req.user);
    const newRecord = await KnowledgeBase.create({
      title,
      content: finalContent,
      category: category || "Auto Imported",
      tags: parseTags(tags),
      sourceFile: finalSourceFile,
      sourceType,
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
          category: category || "Auto Imported",
          tags: parseTags(tags),
          sourceFile: finalSourceFile,
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
      record.content = extracted.text || record.content;
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
