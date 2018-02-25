import React, { Component } from 'react';
import logo from './logo.svg';

class App extends Component {
  render() {
    return (
      <div className='App'>
      <nav class="navbar navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </nav>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt="logo" />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
