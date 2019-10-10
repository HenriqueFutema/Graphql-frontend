import React, { Component } from 'react';

import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { usersQuery } from './UserList'

const createUserMutation = gql`
    mutation createUser($name: String!, $email: String!){
        createUser(name: $name, email: $email){
            id
            name
            email
        }

    }
`


export default class UserForm extends Component {

    state = {
        name: '',
        email: ''
    }

    handleSubmit = (e, createUser) =>{
        e.preventDefault()

        const { name, email } = this.state

        createUser({
            variables: { name, email },
            update: (proxy, { data: { createUser } }) =>{
                const { users } = proxy.readQuery({
                    query: usersQuery
                })


                proxy.writeQuery({
                    query: usersQuery,
                    data: { users: users.concat([createUser]) }
                })

            }
        })

        this.setState({ name: '', email: '' })

    }

    handleChange = (e) =>{
        this.setState({ [e.target.name]: e.target.value })
    }

  render() {

    const { name, email } = this.state

    return(
        <Mutation mutation={createUserMutation}>
            {createUser => (
                <form onSubmit={(e) => this.handleSubmit(e, createUser)}>
                    <input type="text" name="name" value={name} onChange={this.handleChange}/>
                    <input type="text" name="email" value={email} onChange={this.handleChange}/>

                    <button type="submit">Enviar</button>
                </form>                
            )}
        </Mutation>
    );
  }
}
