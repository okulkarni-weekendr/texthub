import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import registerServiceWorker from './registerServiceWorker';
import 'draft-js/dist/Draft.css';
import 'font-awesome/css/font-awesome.min.css';
import routes from './config/routes';

ReactDOM.render(routes, document.getElementById('root'));
registerServiceWorker();
