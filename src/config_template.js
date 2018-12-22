/*
    Board config file template.
    Only 3 columns are currently supported.
    Set the name of each column. e.g. Todo, Doing, Done using the column.name property.
    For each column, set the github api url to pull the column cards.
    Set your github oauth token in the githubToken property and remember not to check it to github.
    Use a personal access token with read access to your repos.
    Rename this file to config.js.
*/
const config = {
    columns: [
        {
            apiUrl: '/projects/columns/3919141/cards',
            background: '#FF6B60',
            color: 'black',
            issues: [],
            name: 'TODO'
        },
        {
            apiUrl: '/projects/columns/3919142/cards',
            background: '#FFCF3F',
            color: 'black',
            issues: [],
            name: 'DOING'
        },
        {
            apiUrl: '/projects/columns/3919145/cards',
            background: '#6AE868',
            color: 'black',
            issues: [],
            name: 'DONE'
        },
    ],
    githubBaseUrl: 'https://api.github.com',
    githubToken: 'your_github_personal_access_token_goes_here',
    issuesUpdatePeriodSecs: 3,
    labelsCount: 3,
    maxColumnCards: 5,
    updatesIntervalHours: 24
}

export default config;
