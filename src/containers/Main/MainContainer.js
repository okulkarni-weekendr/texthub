import React from 'react';
import Navbar from "../Navbar/Navbar";

class MainContainer extends React.Component {

    render(){
        return (
            <div className='App'>
                <Navbar/>
                <hr/>
                <header className='App-header'>
                    <h1 className='App-title'>Welcome to React</h1>
                </header>
                <p className='App-intro'>
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
            </div>
        )
    }
}

export default MainContainer;