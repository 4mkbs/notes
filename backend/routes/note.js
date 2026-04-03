const express = require("express");
const router = express.Router();
const Note = require("../models/note.model");
const { authenticateToken } = require("../utilities");

const MAX_SEARCH_LENGTH = 100;
const MAX_PAGE_SIZE = 100;

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizePagination = (page, limit) => {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const rawLimit = Number.parseInt(limit, 10) || 20;
  const safeLimit = Math.min(Math.max(1, rawLimit), MAX_PAGE_SIZE);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};

// Add note
router.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;
  if (!title || !content) {
    return res
      .status(400)
      .json({ error: true, message: "Title and content required" });
  }
  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });
    await note.save();
    return res.json({ error: false, note, message: "Note added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// Edit note
router.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;
  const hasTitle = title !== undefined;
  const hasContent = content !== undefined;
  const hasTags = tags !== undefined;
  if (!hasTitle && !hasContent && !hasTags && isPinned === undefined) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }
    if (hasTitle) note.title = title;
    if (hasContent) note.content = content;
    if (hasTags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// Get all notes
router.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { search: query = "", page = "1", limit = "20" } = req.query;
  try {
    if (query.length > MAX_SEARCH_LENGTH) {
      return res.status(400).json({
        error: true,
        message: `Search query cannot exceed ${MAX_SEARCH_LENGTH} characters`,
      });
    }

    const {
      page: safePage,
      limit: safeLimit,
      skip,
    } = normalizePagination(page, limit);
    const escapedQuery = escapeRegex(query);
    const searchFilter = query
      ? {
          userId: user._id,
          $or: [
            { title: { $regex: escapedQuery, $options: "i" } },
            { content: { $regex: escapedQuery, $options: "i" } },
          ],
        }
      : { userId: user._id };
    const [notes, total] = await Promise.all([
      Note.find(searchFilter)
        .sort({
          isPinned: -1,
          createOn: -1,
        })
        .skip(skip)
        .limit(safeLimit),
      Note.countDocuments(searchFilter),
    ]);

    return res.json({
      error: false,
      notes,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit) || 1,
      },
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// Delete note
router.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }
    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({ error: false, message: "Note deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// Update isPinned
router.put(
  "/update-note-pinned/:noteId",
  authenticateToken,
  async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;
    if (isPinned === undefined) {
      return res
        .status(400)
        .json({ error: true, message: "isPinned value is required" });
    }
    try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });
      if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }
      note.isPinned = isPinned;
      await note.save();
      return res.json({
        error: false,
        note,
        message: "Note pinned status updated successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }
);

module.exports = router;
