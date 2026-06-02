const mongoose = require("mongoose");

const searchSchema = mongoose.Schema({
  search: { type: String, required: true, trim: true, minlength: 1 },
  includeWordList: { type: [String], default: [] },
  excludeWordList: { type: [String], default: [] },
  description: { type: String, default: "" },
});

const Search = mongoose.model("Search", searchSchema);
module.exports = Search;
