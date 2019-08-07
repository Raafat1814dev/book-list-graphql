// creating the express app

const express = require("express");
// import the express-graphql package
const graphqlHTTP = require("express-graphql");
// import the schema
const schema = require("./schema/schema");
// import mongoose
const mongoose = require("mongoose");
// loading the .env
require("dotenv").config();
console.log(process.env.MONGODB_URL);

//! 1.3 preparation for the production environment
const path = require("path");

// import cors   // for cross origin so that we can query from the server 3000 to this server 4000
const cors = require("cors");

// set up the app .. invoke the express function to create our app
const app = express();

// allow cross-origin requests #########################################
app.use(cors());

// ##############################################
// connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

// set up an event-listener // once the connection is open >> then fire the call back function
mongoose.connection.once("open", () => {
  console.log("connected to the Atlas DB");
});
// ##############################################

app.use(
  "/graphql",
  graphqlHTTP({
    // schema: schema
    schema,
    // Graphiql   to test  >> true >> we want to use the Graphiql tool when we go to >>> /graphql <<< in the browser
    graphiql: true
  })
);

//! 2.3 preparation for the production environment
// when we hit any Route .. it will take us to the index.html inside the public folder
app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

//! 3.3 preparation for the production environment
const port = process.env.PORT || 4000;
// tell our app to listen to a specific port on our computer
app.listen(port, () => {
  // this is a call back function, when our app begins to listening to port 4000 , when this occurs,, the call back function is going to fire
  console.log(`now listening for requests on port ${port}`);
});

// in the terminal >>>> node app  //
// ctrl C  // to exit out of that process

// if you have nodemon on your computer
// nodemon app  >>>app is the file name

//##############################################
// in order to make React(or other Frameworks) to understand GraphQL (which is not a JS) we need
// to use a GraphQL client- one of them is called Apollo
// Apollo is going to help us bind GraphQL to our React-app
// so we can make Queries using GraphQL to our Server

// by using Apollo Clients it can help us create a query and then
// bind that Query to a component so that when that component renders in the
// browser automatically behind the scenes Apollo is handling that query to
// the server and returning any information  so that we can show it inside the component
