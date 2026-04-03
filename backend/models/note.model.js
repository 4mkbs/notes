const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  isPinned: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createOn: { type: Date, default: Date.now },
});

noteSchema.index({ userId: 1, isPinned: -1, createOn: -1 });
noteSchema.index({ title: "text", content: "text", tags: "text" });

module.exports = mongoose.model("Note", noteSchema);
