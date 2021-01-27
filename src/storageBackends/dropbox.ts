import { Dropbox, files } from 'dropbox'
import { StorageBackend, StorageBackendInfo, TaskListState } from '../core/models'

const CLIENT_ID = 'qf4qj6a6oodfh1m'

export class DropboxBackend implements StorageBackend {
    readonly displayName = 'Dropbox'

    async get(taskListId: string): Promise<TaskListState | null> {
        if (!isAuthenticated()) { return null }
        const response = await getAuthenticatedClient()
            .filesDownload({path: filePath(taskListId)});
        const textResponse = await ((response.result as any).fileBlob.text() as Promise<string>);
        return JSON.parse(textResponse);
    }

    async save(taskListId: string, taskListState: TaskListState): Promise<void> {
        if (!isAuthenticated()) { return }
        await getAuthenticatedClient()
            .filesUpload({
                path: filePath(taskListId),
                contents: JSON.stringify(taskListState),
                mode: 'overwrite'
            } as any);
    }

    async list(): Promise<string[]> {
        if (!isAuthenticated()) { return []; }
        const response = await getAuthenticatedClient()
            .filesListFolder({path: ''});

        return response.result.entries
            .filter(e => e['.tag'] === 'file')
            .map(e => e as files.FileMetadataReference)
            .sort((a, b) => new Date(a.server_modified) < new Date(b.server_modified) ? 1 : -1)
            .map(e => e.path_lower.match(/\/(.+)\.json/))
            .filter(e => !!e)
            .map(e => e[1]);
    }

}

export function getAuthUrl() {
    var dbx = new Dropbox({ clientId: CLIENT_ID });
    return (dbx as any).auth.getAuthenticationUrl(`${location.protocol}//${location.host}/dropbox-callback.html`) as Promise<string>;
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
