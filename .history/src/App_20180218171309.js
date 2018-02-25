import React, { Component } from 'react';
import logo from './logo.svg';

class App extends Component {
  render() {
    return (
      <div className='App'>
      <nav class="navbar navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Navbar</a>
        
        <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
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
