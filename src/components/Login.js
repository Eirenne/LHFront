import React, { Component } from 'react'
import {  Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loggedIn: false
        }
    }

    handleSubmit = event => {
        event.preventDefault();

        axios.post(
            'http://localhost:8001/api/v1/users/authenticate',
            {
                username: this.state.username,
                password: this.state.password
            }, {
                withCredentials: true
            }
        ).then(res => {
            this.setState({loggedIn: true})
        }).catch((err) => {
            this.setState({error:err})
        })
    }

    render() {
        if (this.state.loggedIn === true) {
            return <Redirect to='/' />
        }
        return (
            <div className='login-form' style ={{marginTop:'100px'}}>
                
                <style>{`
            body > div,
            body > div > div,
            body > div > div > div.login-form {
                height: 100%;
            }
            `}
                </style>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            Log-in to your account
                        </Header>
                        <Form size='large' onSubmit={this.handleSubmit}>
                            <Segment stacked>
                                <Form.Input
                                    fluid icon='user'
                                    iconPosition='left'
                                    placeholder='E-mail address'
                                    onChange={(e) => this.setState({ username: e.target.value })}
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                />

                                <Form.Button color='teal' fluid size='large' >
                                    Login
                                </Form.Button>
                            </Segment>
                        </Form>
                        <Message>
                            New to us? <Link to='/register'>Sign Up</Link> 
                        </Message>
                        {this.state.error &&
                            <div class="ui negative message">
                                
                                    Couldn't Log In With Supplied Credentials
                        
                            </div>
                        }
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}


export default Login