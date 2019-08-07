import React, { Component } from "react";

//#######################################
// import { gql } from "apollo-boost";
import { getBooksQuery } from "../queries/queries";
import { graphql } from "react-apollo";

// components
import BookDetails from "./BookDetails";

// 1. create a query   // we place the query directly after the gql`inside a template string`
/*
const getBooksQuery = gql`
  {
    books {
      name
      id
    }
  }
`;
*/
class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  // function to control the output of the book data to the screen in the component
  displayBooks() {
    var data = this.props.data;
    if (data.loading) {
      return <div>Loading Books ...</div>;
    } else {
      return data.books.map(book => {
        // return <li key={book.id}> {book.name} </li>;
        return (
          <li
            key={book.id}
            onClick={e => {
              this.setState({ selected: book.id });
            }}
          >
            {" "}
            {book.name}{" "}
          </li>
        );
      });
    }
  }

  render() {
    // this is the place where the query is !!!!!
    console.log(this.props);

    return (
      <div>
        <ul id="book-list">
          {/* <li>Book name</li> */}
          {this.displayBooks()}
        </ul>
        <BookDetails bookId={this.state.selected} />
      </div>
    );
  }
}

// export default BookList;
// 2. bind the query to the component
export default graphql(getBooksQuery)(BookList);

// we will feed the queries to the GraphQL client >> Apollo
// which will send the request to the server
// the Server then is going to respond feed the Data back
// to our GraphQL client >>> Apollo, which will then pass it
// back into our React application

// so we can think of the GraphQL client as the thing that is
// in charge of the passage of data between the front-end
// and the Server (back-end)
// npm install apollo-boost react-apollo graphql

// #########################
// who do we make queries in a component ?
// 1. we need to construct a query // like we did in GraphQL
// 2. we take that query and we bind it to the component, so
// that we inside the component we have access to all the data that
// comes back from the query
