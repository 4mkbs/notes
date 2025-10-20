const express = require("express");
const router = express.Router();
const Note = require("../models/note.model");
const { authenticateToken } = require("../utilities");

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
  if (!title && !content && !tags && isPinned === undefined) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
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
  const { search: query = "" } = req.query;
  try {
    const searchFilter = query
      ? {
          userId: user._id,
          $or: [
            { title: { $regex: new RegExp(query, "i") } },
            { content: { $regex: new RegExp(query, "i") } },
          ],
        }
      : { userId: user._id };
    const notes = await Note.find(searchFilter).sort({
      isPinned: -1,
      createOn: -1,
    });
    return res.json({
      error: false,
      notes,
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

// Search notes
router.get("/search-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }
  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    }).sort({ isPinned: -1, createOn: -1 });
    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
