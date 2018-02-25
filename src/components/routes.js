import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App/App';
import Editor from './Editor/Editor';

export default(
    <Route path="/" component={App}>
        <IndexRoute component={Editor}>
            <Route path="editor" component={Editor}/>
        </IndexRoute>
    </Route>
)