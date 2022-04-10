import config from "../../config"
import { Dropbox, files } from "dropbox"
import { StorageBackend, TaskListState } from "../models"

import icon from "../../assets/storageBackends/dropbox.svg"

export class DropboxBackend implements StorageBackend {
  readonly displayName = "Dropbox"
  readonly iconUrl = icon

  isAuthenticated() { return !!getAccessToken(); }
  async getAuthenticationUrl() {
    const dbx = new Dropbox({ clientId: config.dropboxClientID });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await ((dbx as any).auth
      .getAuthenticationUrl(`${location.protocol}//${location.host}/dropbox-callback.html`) as Promise<string>);
  }

  async get(taskListId: string): Promise<TaskListState | null> {
    if (!this.isAuthenticated()) { return null }
    try {
      const response = await getAuthenticatedClient()
        .filesDownload({path: filePath(taskListId)});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const textResponse = await ((response.result as any).fileBlob.text() as Promise<string>);
      return JSON.parse(textResponse);
    } catch (err) {
      if (errorIsNotFound(err)) return null;
      throw err;
    }
  }

  async save(taskListId: string, taskListState: TaskListState): Promise<void> {
    if (!this.isAuthenticated()) { return }
    await getAuthenticatedClient()
      .filesUpload({
        path: filePath(taskListId),
        contents: JSON.stringify(taskListState),
        mode: "overwrite"
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  async list(): Promise<string[]> {
    if (!this.isAuthenticated()) { return []; }
    const response = await getAuthenticatedClient()
      .filesListFolder({path: ""});

    return response.result.entries
      .filter(e => e[".tag"] === "file")
      .map(e => e as files.FileMetadataReference)
      .sort((a, b) => new Date(a.server_modified) < new Date(b.server_modified) ? 1 : -1)
      .map(e => e.path_lower ? e.path_lower.match(/\/(.+)\.json/) : null)
      .filter((e) => (e !== null))
      .map(e => e ? e[1] : "");
  }

}

const filePath = (taskListId: string) => `/${taskListId}.json`;

function getAccessToken() {
  return localStorage.getItem("egin_dropbox_access_token")
}

function getAuthenticatedClient() {
  const accessToken = getAccessToken();
  if (!accessToken) { throw new Error("You are not authenticated") }
  return new Dropbox({ accessToken });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function errorIsNotFound(err: any) {
  return err.name === "DropboxResponseError"
        && err.error.error[".tag"] === "path"
        && err.error.error.path[".tag"] === "not_found";
}
