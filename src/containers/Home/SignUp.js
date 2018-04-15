import React, { Component } from 'react';
import {
    Link,
    withRouter,
    } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import { paths } from '../../constants';

const SignUpPage = ({ history }) =>
    <div>
        <h1>Sign Up</h1>
        <SignUpForm history={history}/>
    </div>;

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const byPropsKey = (propertyName, value) => () => ({
    [propertyName]: value
});

class SignUpForm extends Component {
    constructor(props){
        super(props);
        this._onSubmit = this._onSubmit.bind(this);
        this.state = {
            ...INITIAL_STATE
        }
    }

    _onSubmit = (event) => {
        const {
            username,
            email,
            passwordOne,
        } = this.state;

        const {
            history,
        } = this.props;

        auth.createUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.setState(() => ({
                    ...INITIAL_STATE
                }));
                history.push(paths.HOME);
            })
            .catch(error => {
                this.setState(byPropsKey('error', error));
            });

        event.preventDefault();
    };

    render(){
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        //have a look at this later on.. not clear why you need a higher order function here..
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    value={username}
                    onChange={event => this.setState(byPropsKey('username', event.target.value))}
                    type="text"
                    placeholder="Full Name"
                />
                <input
                    value={email}
                    onChange={event => this.setState(byPropsKey('email', event.target.value))}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    value={passwordOne}
                    onChange={event => this.setState(byPropsKey('passwordOne', event.target.value))}
                    type="password"
                    placeholder="Password"
                />
                <input
                    value={passwordTwo}
                    onChange={event => this.setState(byPropsKey('passwordTwo', event.target.value))}
                    type="password"
                    placeholder="Confirm Password"
                />
                <button disabled={isInvalid} type="submit">
                    Sign Up
                </button>
                { error && <p>{error.message}</p> }
            </form>
        );
    }
}

const SignUpLink = () =>
    <p>
    Don't have an account?
        { ' ' }
        <Link to={paths.SIGN_UP}>Sign Up</Link>
    </p>;

export default withRouter(SignUpPage);

export {
    SignUpForm,
    SignUpLink
};






