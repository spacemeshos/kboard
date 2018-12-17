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
            color: '#FF6B60',
            issues: [],
            name: 'Todo',
        },
        {
            apiUrl: '/projects/columns/3919142/cards',
            color: '#FFCF3F',
            issues: [],
            name: 'Doing',
        },
        {
            apiUrl: '/projects/columns/3919145/cards',
            color: '#6AE868',
            issues: [],
            name: 'Done',
        },
    ],
    githubBaseUrl: 'https://api.github.com',
    githubToken: 'your_github_access_token_goes_here',
    labelsCount: 2,
}

export default config;
