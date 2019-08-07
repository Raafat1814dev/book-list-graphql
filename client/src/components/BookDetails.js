import React, { Component } from "react";
import { graphql } from "react-apollo";
import { getBookQuery } from "../queries/queries";

class BookDetails extends Component {
  displayBookDetails() {
    const { book } = this.props.data;
    if (book) {
      return (
        <div>
          <h2>{book.name}</h2>
          <p>{book.genre}</p>
          <p>{book.author.name}</p>
          <p>All books by this author: </p>
          <ul className="other-books">
            {book.author.books.map(item => {
              return <li key={item.id}>{item.name}</li>;
            })}
          </ul>
        </div>
      );
    } else {
      return <div>No book selected ... </div>;
    }
  }
  render() {
    console.log(this.props);
    return (
      <div id="book-details">
        <p>Output book details here </p>
        {this.displayBookDetails()}
      </div>
    );
  }
}
// without a variable
// export default graphql(getBookQuery)(BookDetails);
// with a variable
export default graphql(getBookQuery, {
  // so whenever that props updates, this function is going to rerun
  // and reset the variables for the query
  options: props => {
    return {
      variables: {
        id: props.bookId
      }
    };
  }
})(BookDetails);

// to show the information of a selected book // go to BookList.js
// 1. we need to listen out for when a user clicks on one of the items (book name)
// 2. find out the ID of the item that was clicked
// 3. pass the ID as a prop down into the BookDetails-component
// 4. when we have the ID as a prop, we can easily use that prop as
// a query variable in the query associated with this component
// to go and get a single book !!!!
