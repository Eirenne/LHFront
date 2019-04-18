import React, { Component, PropTypes } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import axios from 'axios'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    handleSubmit = event => {
        console.log(this.state)
        event.preventDefault();
       
        axios.post(
            'http://localhost:8001/api/v1/users/authenticate',
            {
                username: this.state.username,
                password: this.state.password
            },{
                withCredentials: true
            }
          ).then(res => {
            console.log(res)
            axios.get(
                'http://localhost:8001/api/v1/ping',
                {
                    withCredentials: true
                }
            ).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
          }).catch((err) => {
            console.log(err)
      })
    }

    render() {
        return (
            <div className='login-form'>
                {/*
            Heads up! The styles below are necessary for the correct render of this example.
            You can do same with CSS, the main idea is that all the elements up to the `Grid`
            below must have a height of 100%.
            */}
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
                                    onChange={(e) => this.setState({username: e.target.value})}
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    onChange={(e) => this.setState({password: e.target.value})}
                                />

                                <Form.Button color='teal' fluid size='large' >
                                    Login
                                </Form.Button>
                            </Segment>
                        </Form>
                        <Message>
                            New to us? <a href='#'>Sign Up</a>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}


export default Login