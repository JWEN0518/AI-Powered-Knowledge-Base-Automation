const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const upload = require("../utils/upload");
const {
  listRecords,
  createRecord,
  updateRecord,
  updateStatus,
  deleteRecord
} = require("../controllers/knowledgeBaseController");

const router = express.Router();

router.get("/", authMiddleware, listRecords);
router.post("/", authMiddleware, requireRole("Editor"), upload.single("file"), createRecord);
router.put("/:id", authMiddleware, requireRole("Editor"), upload.single("file"), updateRecord);
router.patch("/:id/status", authMiddleware, requireRole("Reviewer"), updateStatus);
router.delete("/:id", authMiddleware, requireRole("Editor"), deleteRecord);

module.exports = router;
