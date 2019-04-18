import React, { Component } from 'react'
import Places from './placesList'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

class Home extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      redirect: false,
    };
  }
  componentDidMount() {
    axios.get('http://localhost:8001/api/v1/checkToken', {
      withCredentials: true,
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false });
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false, redirect: true });
      })
    fetch('/checkToken')
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false });
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false, redirect: true });
      });
  };

  render() {
    const { loading, redirect } = this.state;
    if (loading) {
      return null;
    }
    if (redirect) {
      return <Redirect to="/log-in" />;
    }
    return (
      <Places></Places >
    )
  }

}

export default Home