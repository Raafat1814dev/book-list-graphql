//before we start putting data in the data base
// we need to create a model and schema for each data type
// that we will be storing inside that database
// this is something other than the schema of the GraphQL Schema

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  // this object is going to describe the deferent data-type and properties
  // we would expect on a book
  name: String,
  genre: String,
  authorId: String
  // and we don't need to define an ID .. MongoDB will create that automatically
});

// export a Model
// we are making a model(a collection), we name it "Book", and
// this collection inside the database is going to have objects
// inside of it that looks like the bookSchema !!!
module.exports = mongoose.model("Book", bookSchema);
// later on we are going to use this model to interact with
// our book collection in MongoDB
