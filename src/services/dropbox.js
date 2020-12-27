import Dropbox from 'dropbox'

import { state } from '../core/state'
import * as history from '../core/history'

const CLIENT_ID = 'qf4qj6a6oodfh1m'

let lastSavedState = ''

export function isAuthenticated() {
    return !!getAccessToken();
}

export function getAuthUrl() {
    var dbx = new Dropbox.Dropbox({ clientId: CLIENT_ID });
    return dbx.auth.getAuthenticationUrl(`${location.protocol}//${location.host}/dropbox-callback.html`);
}

export function load() {
    return stateFileExists()
        .then(exists => {
            return exists
                ? loadStateFile().then(remoteState => setState(remoteState))
                : saveStateFile(state)
        })
}

export function save() {
    return saveStateFile(state)
}

export function getAuthenticatedClient() {
    const accessToken = getAccessToken();
    if (!accessToken) { throw new Error("You are not authenticated") }
    return new Dropbox.Dropbox({ accessToken });
}

function setState(newState) {
    Object.keys(newState).forEach(k => {
        state[k] = newState[k]
    })
    lastSavedState = JSON.stringify(state)
    history.reset()
}

function stateFileExists() {
    return getAuthenticatedClient().filesListFolder({path: ''})
        .then(response => {
            return response.result.entries.filter(e => e.path_lower === '/state.json').length > 0
        });
}

function loadStateFile() {
    return getAuthenticatedClient().filesDownload({path: '/state.json'})
        .then(response => {
            return response.result.fileBlob.text()
        })
        .then(text => {
            return JSON.parse(text)
        })
}

function saveStateFile(content) {
    const jsonContent = JSON.stringify(content)
    if (jsonContent === lastSavedState) { return Promise.resolve() }
    return getAuthenticatedClient()
        .filesUpload({path: '/state.json', mode: 'overwrite', contents: jsonContent})
        .then(() => {
            lastSavedState = jsonContent
        })
}

function getAccessToken() {
    return localStorage.getItem('egin_dropbox_access_token')
}
