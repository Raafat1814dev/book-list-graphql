// create a query to retrieve the Authors so that we can put them
// in a drop down list so we could choose from it
// because we don't expect the user to know the author ID
import React, { Component } from "react";
// import { gql } from "apollo-boost";
import {
  getAuthorsQuery,
  addBookMutation,
  getBooksQuery
} from "../queries/queries";
// we will use the compose to bind more than one query to this component
import { graphql, compose } from "react-apollo";
/*
const getAuthorsQuery = gql`
  {
    authors {
      name
      id
    }
  }
`;
*/

class AddBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      genre: "",
      authorId: ""
    };
  }
  displayAuthors() {
    // var data = this.props.data;
    // console.log(this.props); // this shows us that we now get two different
    // queries not like when we hade only one query we recieved only data
    // but now we get back  addBookMutation and getAuthorQuery
    var data = this.props.getAuthorsQuery; // this name comes from the
    // down where we made the binding and gave it a name
    // graphql(getAuthorsQuery, {name: "getAuthorsQuery"})

    if (data.loading) {
      return <option disabled>Loading Authors....</option>;
    } else {
      return data.authors.map(author => {
        return (
          // the "value" we need it so we know which option is selected
          // so we can take the id to use it to create a new book
          <option value={author.id} key={author.id}>
            {author.name}
          </option>
        );
      });
    }
  }
  submitForm(e) {
    // when we click on the button .. it automatically refresh the page
    // that is the default behavior, and we want to stop that default behavior
    e.preventDefault();

    // console.log(this.state);
    // this.props.addBookMutation(); // this name comes from the end of the page
    // where we bind the two Queries to this component .. we gave them a name too !!!!
    if (
      this.state.name &&
      this.state.genre &&
      this.state.authorId &&
      this.state.authorId !== "Select author"
    ) {
      this.props.addBookMutation({
        variables: {
          name: this.state.name,
          genre: this.state.genre,
          authorId: this.state.authorId
        },
        // to tell GraphQL to or now it is Apollo
        // to go and re-fetch a particular query
        refetchQueries: [{ query: getBooksQuery }]
      });
    }
    // clear the form and the values after submitting
    document.getElementById("add-book").reset();
    this.setState({
      name: "",
      genre: "",
      authorId: ""
    });
  }
  // todo >>> change the place where you update the state
  //! the state should not be updated in the render() method !!!!
  render() {
    return (
      // we need to attach an event-Listener to this form
      // so that when it is submitted we fire some kind of a function
      <form id="add-book" onSubmit={this.submitForm.bind(this)}>
        <div className="field">
          <label>Book name:</label>
          <input
            type="text"
            onChange={e => this.setState({ name: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Genre:</label>
          <input
            type="text"
            onChange={e => this.setState({ genre: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Author:</label>
          <select onChange={e => this.setState({ authorId: e.target.value })}>
            <option>Select author</option>
            {this.displayAuthors()}
          </select>
        </div>
        <button>+</button>
      </form>
    );
  }
}
// bind the Query to this Component !!!
// export default graphql(getAuthorsQuery)(AddBook);

// bind more than one queries to the component using compose !!!!
export default compose(
  graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
  graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);
