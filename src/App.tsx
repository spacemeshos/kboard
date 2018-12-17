import * as React from 'react';
import './App.css';
import { Client } from './services/githubapiclient/client';
import { Card } from './components/Card';
import logo from './logo.svg';
import { IData, IColumn, IIssue} from './services/githubapiclient/types';
import config from './config';

export interface IAppState {
    data?: IData;
    error: string;
}

class App extends React.Component<object, IAppState> {

constructor(props: any){
    super(props);
    this.state = { data: undefined, error: "" };
}

public async componentDidMount() {
      // import { IData } from './types';
      const client = new Client();
      try {
        const data: IData = await client.LoadAllData();
        console.log(data);
        this.setState({data, error: ""});
    } catch (err) { // failed to log data
        console.log('Error loading data: ' + err);
        this.setState({data: undefined, error: "" + err});
    }
}

public render() {

    if (this.state.error !== ""){
        return(<div>Error loading {this.state.error}</div>);
    }

    if (this.state.data === undefined){
        return(<div>Loading...</div>);
    }

    return (
        <div className="main-container">
          <div className="col col-1">
            <div className="col-header">
                <p className="col-label">TODO</p>
            </div>
            { this.renderCards(this.state.data.columns[0]) }
          </div>
          <div className="col col-2">
                <div className="col-header">
                    <p className="col-label">DOING</p>
              </div>
              { this.renderCards(this.state.data.columns[1]) }
          </div>
          <div className="col col-3">
                <div className="col-header">
                    <p className="col-label">DONE</p>
                </div>
                { this.renderCards(this.state.data.columns[2]) }
          </div>
        </div>
    );
  }

  private renderCards(column: IColumn): React.ReactNode {

      return (
        <div className="col-content">
        {
            column.issues.map((issue, idx) => (

                issue.Assignee != null ?
                <Card key={idx} title={issue.Title} assignee={issue.Assignee.Login} profileUrl={issue.Assignee.AvatarUrl} labels={issue.Labels} /> :
                <Card key={idx} title={issue.Title} assignee="" profileUrl="" />
            ))
        }
        </div>);
  }
}

export default App;
