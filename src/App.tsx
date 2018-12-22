import * as React from 'react';
import './App.css';
import { Client } from './services/githubapiclient/client';
import { Card } from './components/Card';

import logo from './logo.svg';
import {IColumn, IData, IIssue} from './services/githubapiclient/types';
import VisibleIssues from './services/githubapiclient/visibleIssues';

import config from './config';

export interface IAppState {
    data?: IData;
    error: string;
    visibleIssues: VisibleIssues[];
}

class App extends React.Component<object, IAppState> {

    private interval;
    private issuesUpdateInterval;

constructor(props: any) {
    super(props);
    this.state = { data: undefined, error: "", visibleIssues: new Array<VisibleIssues>() };
}

public async componentDidMount() {
    const periodMsecs = config.updatesIntervalHours * 60 * 60 * 1000;
    this.interval = setInterval(() => {
      this.getBoardData();
    }, periodMsecs);

    await this.getBoardData();
    this.updateVisibleIssues();

    const cardsUpdateMs = config.issuesUpdatePeriodSecs * 1000;
    this.issuesUpdateInterval = setInterval(() => {
      this.updateVisibleIssues();
    }, cardsUpdateMs);
}

public async componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.issuesUpdateInterval);
}

public render() : React.ReactNode {

    if (this.state.error !== ""){
        return(<div>Error loading {this.state.error}</div>);
    }

    if (this.state.data === undefined){
        return(<div>Loading...</div>);
    }

    return (
        <div className="main-container">
            { this.renderColumn(0) }
            { this.renderColumn(1) }
            { this.renderColumn(2) }
        </div>
    );
}

private async getBoardData() : Promise<void> {
      const client = new Client();
      try {
        const data: IData = await client.LoadAllData();
        console.log(data);
        this.setState({data, error: "", visibleIssues: new Array<VisibleIssues>()});
    } catch (err) { // failed to load data
        console.log('Error loading data: ' + err);
        this.setState({data: undefined, error: "" + err, visibleIssues: new Array<VisibleIssues>()});
    }
}

private async updateVisibleIssues() : Promise<void> {

      if (this.state.data == null) {
          return Promise.resolve();
      }

      const colsVisIssues = new Array<VisibleIssues>(3);

      for(let i = 0; i < 3; i++) {

          const c = this.state.data.columns[i];

          let vbs: VisibleIssues;
          if (this.state.visibleIssues.length === 0) {
              vbs = new VisibleIssues();
              vbs.firstIssueIdx = 0;
          } else {
              vbs = this.state.visibleIssues[i];
              vbs.firstIssueIdx += 1;
              if (vbs.firstIssueIdx === c.issues.length) {
                  vbs.firstIssueIdx = 0;
              }
          }

          // console.log("Col: " + i + ", firstIssueIdx: " + vbs.firstIssueIdx + ", col issues: " + c.issues.length);

          let take = config.maxColumnCards;
            if (take + vbs.firstIssueIdx < c.issues.length) {
              vbs.issues = c.issues.slice(vbs.firstIssueIdx, vbs.firstIssueIdx + take);
              // console.log("Taking " + take + " issues from " + vbs.firstIssueIdx);
          } else {
              take = c.issues.length - vbs.firstIssueIdx;
              vbs.issues = c.issues.slice(vbs.firstIssueIdx, vbs.firstIssueIdx + take);

              if (c.issues.length > config.maxColumnCards) {
                  const take1 = config.maxColumnCards - take;
                  // console.log("Taking " + take1 + " issues from start...");
                  vbs.issues.push(...c.issues.slice(0, take1));
              }
          }

          // console.log("vbs legnth: " + vbs.issues.length);
          colsVisIssues[i] = vbs;
    }

    this.setState({visibleIssues:colsVisIssues});
}

private renderColumn(i: number): React.ReactNode {

    if (this.state.data == null) {
        return null;
    }

    const c = this.state.data.columns[i] as IColumn;

    return(
          <div className="col" style={{background: c.background}}>
            <div className="col-header">
                <p className="col-label" style={{color: c.color}}>{c.name}</p>
                <p className="number-pill">{c.issues.length}</p>
            </div>
            { this.renderIssues(i) }
          </div>
      );
  }

private renderIssues(cid: number): React.ReactNode {

    if (this.state.visibleIssues.length === 0) {
        return null;
    }

    const issues = this.state.visibleIssues[cid].issues;

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
