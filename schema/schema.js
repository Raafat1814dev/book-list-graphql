// in this file is where we are going to define our schema
const graphql = require("graphql");

// import the models to interact with the collections on MongoDB
const Book = require("../models/book");
const Author = require("../models/author");

// describe the object types we want on our graph

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

// dummy data
/*
var books = [
  { name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1" },//
  { name: "The Final Empire", genre: "Fantasy", id: "2", authorId: "2" },
  { name: "The Long Earth", genre: "Sci-Fi", id: "3", authorId: "3" }, // 
  { name: "The Hero of Ages", genre: "Fantasy", id: "4", authorId: "2" }, // 
  { name: "The Color of Magic", genre: "Fantasy", id: "5", authorId: "3" }, // 
  { name: "The Light Fantastic", genre: "Fantasy", id: "6", authorId: "3" } // 
];

var authors = [
  { name: "Patrick Rothfuss", age: 44, id: "1" },
  { name: "Brandon Sanderson", age: 42, id: "2" },
  { name: "Terry Partchett", age: 66, id: "3" }
];
*/

// define a new object type
const BookType = new GraphQLObjectType({
  // this object is going to define what this book type is all about
  name: "Book",
  // the fields are going to be things like name property, genre an ID .. that kind of thing
  fields: () => ({
    // the reason this needs to be a function is because later on when we have multiple types and
    // they have references to one another then unless we wrap those fields in a function one type
    // might not necessary know what another type is
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    // type relations we put the author here so that when the user query a book and
    // he wants to know the author of it
    author: {
      type: AuthorType,
      // the resolve function is responsible for going our and grabbing data
      // so we will use this resolve function inside the author to tell QraphQL whick
      // author corresponse to this book
      resolve(parent, args) {
        // console.log(parent);
        // return authors.find(({ id }) => id === parent.authorId);
        // we use Author-Model to interact with the MongoDB
        return Author.findById(parent.authorId);
      }
    }
  })
});

// Author Type
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    // register the bookfield
    // * this name here is what we see on the Graphiql test zone !!!!
    // ! this name here is what we see on the Graphiql test zone !!!!
    // * this name here is what we see on the Graphiql test zone !!!!
    books: {
      // the type will not be simply a BookType because every author has potentially
      // a whole list of books not just one book
      // the type: BookType  >> implies that it is just one single book !!
      type: new GraphQLList(BookType),
      // the resolve function is there for us to go out and grab the data that we need
      resolve(parent, args) {
        // return books.filter(({ authorId }) => authorId === parent.id);
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

// Root Query >> which is how we initially jump into the Graph
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // we don't need to wrap this fields inside a function because we don't need to worry about
    // the order so much, in our case inside the Root query
    // this name here "book" is important .. because when we call from the front end
    // we should use the exact name here
    book: {
      type: BookType,
      // the args is saying that when someone want to query a particular book then
      // i expect them to pass some arguments along
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // in this function we write code to get whatever data we need from our database or
        // some other source
        // parent : is going to come to play when we start to loot at relationships between data
        // args >>> args.id we will have access of the id so we can use it to grab the book that the
        // user wants from a database or some other source
        // code to get data from db / other source
        // return books.find(({ id }) => id === args.id);
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return authors.find(({ id }) => id === args.id);
        return Author.findById(args.id);
      }
    },
    // get list of all the books !!!!
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books;
        return Book.find({}); // inside the find empty object {} that mean
        // all match !!
      }
    },
    // get list of all the authors !!!!
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors;
        return Author.find({});
      }
    }
  }
});

// ################
// ################
// we will set up our Mutation in the same way we set up our RootQuery
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  // this is going to let us store the different kinds of
  // mutations that we want to make to add or delete or update and author !!!
  fields: {
    // when someone uses this addAuthor mutation >>> then it is
    // going to allow us to add an author to the database
    // this is the whole idea here
    addAuthor: {
      type: AuthorType,
      // when a user makes a mutation query from the front-end
      // we would expect them to send some kind of data or arguments
      // if they want to add an author then they are going to need to send along
      // the author information // and these info will be passed as arguments !!!!
      args: {
        // name: { type: GraphQLString }, // this will allow the Null values
        name: { type: new GraphQLNonNull(GraphQLString) }, // to prevent the Null values
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      // this is where we take the arguments that they have sent
      // along with the query >> we take them and make new instance of the Author
      resolve(parent, args) {
        // new Author >> this is the Model that we imported from the Models
        let author = new Author({
          name: args.name,
          age: args.age
        });
        // what we have done here is that we created a local variable called author
        // and set it to new local instance ot Author Data type
        // what we need to do now is take this instance of the Author data type (author)
        // and save it in our data base
        // author.save(); // this will only save the author
        return author.save(); // this will save the author and bring it back to
        // to show it to us in the Graphiql
      }
    },
    addBook: {
      type: BookType,

      args: {
        // this is what we would expect the user to send along with his query
        // name: { type: GraphQLString }, // this allow the null
        name: { type: new GraphQLNonNull(GraphQLString) }, // this will prevent the Null values
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});

// ################
// ################

module.exports = new GraphQLSchema({
  // inside here we pass the initial RootQuery
  // we are defining which query we are allowing the user to use when the are making queries from the
  // Front-End >>> so we are saying .. that query is going to be this RootQuery
  query: RootQuery,
  // we export the mutation too to say the in addition to
  // the Querying the user can Mutate too !!!
  mutation: Mutation
});
