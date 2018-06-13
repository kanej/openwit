import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Appbar from './components/appbar'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Appbar title="Openwit"/>
        
        <div>
          <h3>Yer man, Cicero</h3>
          <h4>Thoughts in the passing</h4>
        </div>

        <Button variant="contained" color="primary">
          Follow
        </Button>

        <div>

        </div>

        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

      </div>
    );
  }
}

export default App;
