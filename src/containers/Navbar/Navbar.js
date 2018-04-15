import React, {Component} from 'react';
import {
    Link,
} from 'react-router-dom';
import { paths } from '../../constants';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
                <a className="navbar-brand">texthub</a>
                <div className="navbar-collapse collapse" id="navbar3">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to='/'>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/editor'>Editor</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to={paths.SIGN_UP}>Sign Up </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={paths.ACCOUNT}>Account</Link>
                            </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

Navbar.propTypes = {};

export default Navbar;
