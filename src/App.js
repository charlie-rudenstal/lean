import React, { Component } from 'react';
import { gql, graphql, compose } from 'react-apollo';
import './App.css';

class App extends Component {
  handleCreate = () => {
    this.props.createThing('New Post: ' + Math.floor(Math.random() * 100));
  }

  render() {
    console.log(this.props);
    const { data } = this.props;
    if (data.networkStatus === 1) return <div>Loading</div>;
    const updateStyle = { opacity: 0.2 };
    return (
      <div style={data.networkStatus === 4 ? updateStyle : {}}>
        Things (updated from PR 2):
        <ul>
          {data.allThings.map(thing =>
            <li key={thing.id}>{thing.name}</li>
          )}
        </ul>
        <button onClick={this.handleCreate}>Create</button>
      </div>
    );
  }
}
const thingsQuery = gql`
  query thingsQuery {
    allThings {
      id,
      name
    }
  }`;

const createThingMutation = gql`
  mutation createThing($name: String!) {
    createThing(name: $name) {
      id
    }
  }`;

export default compose(
  graphql(thingsQuery, { options: { notifyOnNetworkStatusChange: true }, }),
  graphql(createThingMutation, {
    props: ({ mutate }) => ({
      createThing: (name) => mutate({
        variables: { name },
        refetchQueries: ['thingsQuery']
      })
    })
  })
)(App);
