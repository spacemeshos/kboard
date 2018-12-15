import * as React from 'react';
import './App.css';
import { Client } from './services/githubapiclient/client';

import logo from './logo.svg';

class App extends React.Component {

public async componentDidMount() {
      // import { IData } from './types';
      const client = new Client();
      await client.LoadAllData();
}


  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
