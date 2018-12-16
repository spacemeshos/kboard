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
        <div className="main-container">
          <div className="col col-1" />
          <div className="col col-2" />
          <div className="col col-3" />
        </div>
    );
  }
}

export default App;
