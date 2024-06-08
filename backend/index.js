const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const commentRouter = require("./routes/commentsRoute");
const db = require("./db/db");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check endpoint
app.get("/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  res.status(200).json({
    server: "Running",
    database: dbStatus,
  });
});

app.use("/", authRouter);
app.use("/products", productRouter);
app.use("/comments", commentRouter);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong! Please try again later." });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`http://${HOST}:${PORT}`);
    });
  })
  .catch((e) => {
    console.log("server not connect", e);
  });

module.exports = app;
