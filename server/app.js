const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const searchRoutes = require("./routes/search");
require("dotenv").config();

const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log("Failed to connect to MongoDB");
    console.log(err);
  });
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/search", searchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// module.exports = app;
