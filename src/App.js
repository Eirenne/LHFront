import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import './App.css';
import Login from './Login';
import Register from './Register';

class App extends Component {
  render() {
    return (
      <Container>
        <Login />
        <Register />
      </Container>
    );
  }
}

export default App;
