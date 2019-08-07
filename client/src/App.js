import React from "react";
// Imports ############################################
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
// ApolloProvider to wrap our application and inject whatever data we receive
// from the Server into our application

// components
import BookList from "./components/BookList.js";
import AddBook from "./components/AddBook";

// Apollo client setup #################################
const client = new ApolloClient({
  // uri is going to be the endpoint that we are making requests or queries too
  // we set that up at the beginning // the endpoint that handles all of our GraphQL Queries

  // uri: "http://localhost:4000/graphql" // the uri for the Development environment
  uri: "/graphql" // the uri for the Production environment

  // now apollo knows that we are going to make requests to this endpoint
  // from our application
});

function App() {
  return (
    // surrounding all our template with the TAG ####################
    // and we need to say what client this is going to be using !!
    <ApolloProvider client={client}>
      <div id="main">
        <h1>Reading list !!</h1>
        <BookList />
        <AddBook />
      </div>
    </ApolloProvider>
  );
}

export default App;
