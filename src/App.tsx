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

    private interval;

constructor(props: any) {
    super(props);
    this.state = { data: undefined, error: "" };
}

public async componentDidMount() {
    const periodMsecs = config.updatesIntervalHours * 60 * 60 * 1000;
    this.interval = setInterval(() => {
      this.getBoardData();
    }, periodMsecs);

    this.getBoardData();
}

public async componentWillUnmount() {
    clearInterval(this.interval);
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
          <div className="col" style={{background: this.state.data.columns[0].background}}>
            <div className="col-header">
                <p className="col-label" style={{color: this.state.data.columns[0].color}}>TODO</p>
            </div>
            { this.renderCards(this.state.data.columns[0]) }
          </div>
          <div className="col" style={{background: this.state.data.columns[1].background}}>
                <div className="col-header">
                    <p className="col-label" style={{color: this.state.data.columns[1].color}}>DOING</p>
              </div>
              { this.renderCards(this.state.data.columns[1]) }
          </div>
          <div className="col" style={{background: this.state.data.columns[2].background}}>
                <div className="col-header">
                    <p className="col-label" style={{color: this.state.data.columns[2].color}}>DONE</p>
                </div>
                { this.renderCards(this.state.data.columns[2]) }
          </div>
        </div>
    );
  }

  private async getBoardData() : Promise<void> {
      const client = new Client();
      try {
        const data: IData = await client.LoadAllData();
        console.log(data);
        this.setState({data, error: ""});
    } catch (err) { // failed to load data
        console.log('Error loading data: ' + err);
        this.setState({data: undefined, error: "" + err});
    }
  }

  private renderCards(column: IColumn): React.ReactNode {

      const n = Math.min(config.maxColumnCards, column.issues.length);

      let issues = column.issues;
      if (issues.length > config.maxColumnCards) {
          issues = issues.splice(0, config.maxColumnCards);
      }

      return (
        <div className="col-content">
        {
            issues.map((issue, idx) => (

                issue.Assignee != null ?
                <Card key={idx} title={issue.Title} assignee={issue.Assignee.Login} profileUrl={issue.Assignee.AvatarUrl} labels={issue.Labels} /> :
                <Card key={idx} title={issue.Title} assignee="" profileUrl="" />
            ))
        }
        </div>);
  }
}

export default App;
