import React from 'react';
import { Route, IndexRoute } from 'react-router';
import MainContainer from './Main/MainContainer';
import Editor from './Editor/Editor';

export default(
    <Route path="/" component={MainContainer}>
        <IndexRoute component={Editor}>
            <Route path="editor" component={Editor}/>
        </IndexRoute>
    </Route>
)