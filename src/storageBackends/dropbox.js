import { Dropbox } from 'dropbox'

const CLIENT_ID = 'qf4qj6a6oodfh1m'

export function get(taskListId) {
    if (!isAuthenticated()) { return Promise.resolve(null) }
    return getAuthenticatedClient()
        .filesDownload({path: filePath(taskListId)})
        .then(response => {
            return response.result.fileBlob.text()
        })
        .then(text => {
            return JSON.parse(text)
        }, (err) => {
            console.log('Tasklist not found', err)
            return null;
        })
}

export function save(taskListId, taskListState) {
    if (!isAuthenticated()) { return Promise.resolve() }
    return getAuthenticatedClient()
        .filesUpload({
            path: filePath(taskListId),
            contents: JSON.stringify(taskListState),
            mode: 'overwrite'
        })
}

export function list() {
    if (!isAuthenticated()) { return Promise.resolve([]) }
    return getAuthenticatedClient()
        .filesListFolder({path: ''})
        .then(response => {
            return response.result.entries
                .map(e => e.path_lower.match(/\/(.+)\.json/))
                .filter(e => !!e)
                .map(e => e[1])
        });
}

export function getAuthUrl() {
    var dbx = new Dropbox({ clientId: CLIENT_ID });
    return dbx.auth.getAuthenticationUrl(`${location.protocol}//${location.host}/dropbox-callback.html`);
}

export function isAuthenticated() {
    return !!getAccessToken();
}

const filePath = (taskListId) => `/${taskListId}.json`;

function getAccessToken() {
    return localStorage.getItem('egin_dropbox_access_token')
}

function getAuthenticatedClient() {
    const accessToken = getAccessToken();
    if (!accessToken) { throw new Error("You are not authenticated") }
    return new Dropbox({ accessToken });
}

// function stateFileExists() {
//     return getAuthenticatedClient().filesListFolder({path: ''})
//         .then(response => {
//             return response.result.entries.filter(e => e.path_lower === '/state.json').length > 0
//         });
// }
