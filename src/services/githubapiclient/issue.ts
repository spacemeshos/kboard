import {IIssue, ILabel, IUser} from './types';

export default class Issue implements IIssue {
    public Title: string;
    public Assignee: IUser;
    public Labels: ILabel[];
}
