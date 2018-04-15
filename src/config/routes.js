import React from 'react';
import { Router, Route, HashRouter } from 'react-router-dom';
import { MainContainer } from '../containers';
import Editor from "../containers/Editor/Editor";
import Home from "../containers/Home/Home";
import SignUpPage from "../containers/Home/SignUp";
import { paths } from '../constants';

const routes = (
    <HashRouter>
        <div>
            <Route exact path={paths.LANDING} component={ MainContainer } />
            <Route exact path='/editor' component={Editor} />
            {/*<Route exact path={routes.SIGN_IN} component={SignInPage} />*/}
            {/*<Route exact path={routes.ACCOUNT} component={Account} />*/}
            <Route exact path={paths.SIGN_UP} component={ SignUpPage } />
        </div>
    </HashRouter>
);

export default routes;