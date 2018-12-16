import config from '../../config';
import {ICard, IColumn, IData, IIssue} from './types';
import Issue from './issue';
import Label from './label';
import User from './user';

export class Client {

    private headers = new Headers({
        'Authorization' : 'token ' + config.githubToken,
        'accept': 'application/vnd.github.inertia-preview+json',
        'cache-control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
    });

    public async LoadAllData(): Promise<IData> {
        const data = {
            columns: new Array<IColumn>(),
        };

        /*
        await Promise.all(config.columns.map(async c => {
            Object.assign(c.issues, await this.LoadColumnData(c));
            data.columns.push(c);
        }));*/

        for (const c of config.columns){
            Object.assign(c.issues, await this.LoadColumnData(c));
            data.columns.push(c);
        }

        console.log("Summary...");
        for (const column of data.columns) {
            console.log("Column: " + column.name);
            console.log("Issues : " + column.issues.length);

            for (const issue of column.issues) {
                console.log(issue);
                console.log(" Title: " + issue.Title);

                if (issue.Assignee == null) {
                    console.log("Nobody assigned to this :-(");
                } else {
                    console.log(" Assignee: " + issue.Assignee.Login + ", img url: " + issue.Assignee.AvatarUrl);
                }

                for (const l of issue.Labels) {
                    console.log("Label: " + l.Name + ", color: " + l.Color);
                }
            }
        }

        return data;
    }

    private async LoadColumnData(c: IColumn): Promise<IIssue[]> {

        const url = config.githubBaseUrl + c.apiUrl;
        const res = new Array<IIssue>();

        const resp = await fetch(url, {headers: this.headers});
        const cards = await resp.json();
        for (const card of cards){
            const issue = await this.GetIssue(card);
            res.push(issue);
        }

        return res;
    }

    // get the github issue for card
    private async GetIssue(c: ICard): Promise<IIssue> {

        const resp = await fetch(c.content_url, { headers: this.headers });
        const data = await resp.json();

        const issue = new Issue();
        issue.Title = data.title;

        if (data.assignee != null) {
            const u = new User();
            u.Login = data.assignee.login;
            u.AvatarUrl = data.assignee.avatar_url;
            issue.Assignee = u;
        }

        issue.Labels = new Array<Label>();

        for (const l of data.labels) {
            const label = new Label();
            label.Name = l.name;
            label.Color = "#" + l.color;
            issue.Labels.push(label);
        }
        return issue;
    }
}
