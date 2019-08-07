const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: String,
  age: Number
});

module.exports = mongoose.model("Author", authorSchema);

// we are going to use the Author model to interact with the
// author collection inside the DB
