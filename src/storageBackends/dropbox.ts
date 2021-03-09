import config from '../config'
import { Dropbox, files } from 'dropbox'
import { StorageBackend, StorageBackendInfo, TaskListState } from '../core/models'

export class DropboxBackend implements StorageBackend {
    readonly displayName = 'Dropbox'

    isAuthenticated() { return !!getAccessToken(); }
    async getAuthenticationUrl() {
        const dbx = new Dropbox({ clientId: config.dropboxClientID });
        return await ((dbx as any).auth
            .getAuthenticationUrl(`${location.protocol}//${location.host}/dropbox-callback.html`) as Promise<string>);
    }

    async get(taskListId: string): Promise<TaskListState | null> {
        if (!this.isAuthenticated()) { return null }
        const response = await getAuthenticatedClient()
            .filesDownload({path: filePath(taskListId)});
        const textResponse = await ((response.result as any).fileBlob.text() as Promise<string>);
        return JSON.parse(textResponse);
    }

    async save(taskListId: string, taskListState: TaskListState): Promise<void> {
        if (!this.isAuthenticated()) { return }
        await getAuthenticatedClient()
            .filesUpload({
                path: filePath(taskListId),
                contents: JSON.stringify(taskListState),
                mode: 'overwrite'
            } as any);
    }

    async list(): Promise<string[]> {
        if (!this.isAuthenticated()) { return []; }
        const response = await getAuthenticatedClient()
            .filesListFolder({path: ''});

        return response.result.entries
            .filter(e => e['.tag'] === 'file')
            .map(e => e as files.FileMetadataReference)
            .sort((a, b) => new Date(a.server_modified) < new Date(b.server_modified) ? 1 : -1)
            .map(e => e.path_lower ? e.path_lower.match(/\/(.+)\.json/) : null)
            .filter((e) => (e !== null))
            .map(e => e ? e[1] : '');
    }

}

const filePath = (taskListId: string) => `/${taskListId}.json`;

function getAccessToken() {
    return localStorage.getItem('egin_dropbox_access_token')
}

function getAuthenticatedClient() {
    const accessToken = getAccessToken();
    if (!accessToken) { throw new Error("You are not authenticated") }
    return new Dropbox({ accessToken });
}
