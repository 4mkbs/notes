require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

if (process.env.CONNECTION_STRING) {
  mongoose.connect(process.env.CONNECTION_STRING);
}

const app = express();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser and same-origin requests without an Origin header.
    if (
      !origin ||
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 200),
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));
app.use(apiLimiter);
app.use(morgan("combined"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Import and use professional routers
const userRouter = require("./routes/user");
const noteRouter = require("./routes/note");
app.use(userRouter);
app.use(noteRouter);

if (require.main === module) {
  const port = Number(process.env.PORT || 8000);
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
