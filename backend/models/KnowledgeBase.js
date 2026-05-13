const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    role: String
  },
  { _id: false }
);

const uploadedFileSchema = new mongoose.Schema(
  {
    originalName: String,
    storedName: String,
    url: String,
    mimeType: String,
    size: Number
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Draft", "Reviewed", "Published"],
      required: true
    },
    changedBy: userInfoSchema,
    changedAt: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      default: ""
    }
  },
  { _id: false }
);

const versionSchema = new mongoose.Schema(
  {
    versionNo: Number,
    title: String,
    content: String,
    category: String,
    tags: [String],
    sourceFile: String,
    uploadedFile: uploadedFileSchema,
    status: String,
    updatedBy: userInfoSchema,
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const knowledgeBaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    originalContent: {
      type: String,
      default: ""
    },
    aiGenerated: {
      type: Boolean,
      default: false
    },
    aiSummary: {
      type: String,
      default: ""
    },
    aiSteps: {
      type: [String],
      default: []
    },
    aiQualityNotes: {
      type: String,
      default: ""
    },
    aiConflictWarning: {
      type: String,
      default: ""
    },
    aiOutdatedWarning: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: "Auto Imported"
    },
    tags: {
      type: [String],
      default: []
    },
    sourceFile: {
      type: String,
      default: ""
    },
    sourceType: {
      type: String,
      enum: ["text", "txt", "pdf", "docx", "image", "msg", "unknown"],
      default: "text"
    },
    uploadedFile: {
      type: uploadedFileSchema,
      default: null
    },
    status: {
      type: String,
      enum: ["Draft", "Reviewed", "Published"],
      default: "Draft"
    },
    creator: userInfoSchema,
    statusHistory: {
      type: [statusHistorySchema],
      default: []
    },
    versions: {
      type: [versionSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("KnowledgeBase", knowledgeBaseSchema);
