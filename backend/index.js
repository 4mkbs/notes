require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

mongoose.connect(process.env.CONNECTION_STRING);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Import and use professional routers
const userRouter = require("./routes/user");
const noteRouter = require("./routes/note");
app.use(userRouter);
app.use(noteRouter);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

module.exports = app;
