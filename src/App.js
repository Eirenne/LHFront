import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import FourOFour from './components/four0four';
import Home from './components/Home'

const App = () => {

  return (
    <div>

        <Container>
      
              <Switch>
                <Route exact path="/" component={Home} />
                <Route
                  path="/log-in"
                  component={Login}
                />
                <Route
                  path="/register"
                  component={Register}
                />
                <Route component={FourOFour} />
              </Switch>
        </Container>
    </div>
  )
}

export default App;
