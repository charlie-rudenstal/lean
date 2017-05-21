import React, { Component } from 'react';
import propTypes from 'prop-types'
import { gql, graphql, compose } from 'react-apollo';
import './App.css';

export class App extends Component {
  static propTypes = {
    data: propTypes.object.isRequired
  }

  handleCreate = () => {
    this.props.createThing('New Post: ' + Math.floor(Math.random() * 100));
  }

  render() {
    console.log(this.props);
    const { data, deleteThing } = this.props;
    if (data.networkStatus === 1) return <div>Loading</div>;
    const updateStyle = { opacity: 0.2 };
    return (
      <div style={data.networkStatus === 4 ? updateStyle : {}}>
        Things (updated from PR):
        <ul>
          {data.allThings.map(thing =>
            <li key={thing.id}>
              <button aria-label="Delete"
                onClick={() => deleteThing(thing.id)}>
                X
              </button>
              {thing.name}
            </li>
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

const deleteThingMutation = gql`
  mutation deleteThing($id: ID!) {
    deleteThing(id: $id) {
      id
    }
  }
`

export default compose(
  graphql(thingsQuery, { options: { notifyOnNetworkStatusChange: true }, }),
  graphql(createThingMutation, {
    props: ({ mutate }) => ({
      createThing: name => mutate({
        variables: { name },
        refetchQueries: ['thingsQuery']
      })
    })
  }),
  graphql(deleteThingMutation, {
    props: ({ mutate }) => ({
      deleteThing: id => mutate({
        variables: { id },
        refetchQueries: ['thingsQuery']
      })
    })
  })
)(App);
