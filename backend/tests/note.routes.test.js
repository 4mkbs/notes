const express = require("express");
const request = require("supertest");

jest.mock("../utilities", () => ({
  authenticateToken: (req, res, next) => {
    req.user = { user: { _id: "user-1" } };
    next();
  },
}));

jest.mock("../models/note.model", () => {
  const Note = jest.fn(function MockNote(data) {
    Object.assign(this, data);
    this._id = this._id || "note-1";
    this.save = jest.fn().mockResolvedValue(this);
  });

  Note.findOne = jest.fn();
  Note.find = jest.fn();
  Note.countDocuments = jest.fn();
  Note.deleteOne = jest.fn();

  return Note;
});

const Note = require("../models/note.model");
const noteRouter = require("../routes/note");

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(noteRouter);
  return app;
};

describe("Note routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /add-note requires title and content", async () => {
    const app = createApp();

    const response = await request(app).post("/add-note").send({
      title: "",
      content: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(Note).not.toHaveBeenCalled();
  });

  test("GET /get-all-notes returns paginated notes", async () => {
    const app = createApp();

    const returnedNotes = [
      { _id: "note-1", title: "A" },
      { _id: "note-2", title: "B" },
    ];
    const limit = jest.fn().mockResolvedValue(returnedNotes);
    const skip = jest.fn(() => ({ limit }));
    const sort = jest.fn(() => ({ skip }));

    Note.find.mockReturnValue({ sort });
    Note.countDocuments.mockResolvedValue(25);

    const response = await request(app)
      .get("/get-all-notes")
      .query({ search: "test", page: 2, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.notes).toHaveLength(2);
    expect(response.body.pagination).toEqual({
      page: 2,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
    expect(Note.find).toHaveBeenCalledWith({
      userId: "user-1",
      $or: [
        { title: { $regex: "test", $options: "i" } },
        { content: { $regex: "test", $options: "i" } },
      ],
    });
  });

  test("GET /get-all-notes rejects very long search query", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/get-all-notes")
      .query({ search: "a".repeat(101) });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  test("DELETE /delete-note/:noteId returns 404 when note is missing", async () => {
    const app = createApp();
    Note.findOne.mockResolvedValue(null);

    const response = await request(app).delete("/delete-note/missing-note");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("Note not found");
  });
});
