export interface StorageBackendInfo {
  readonly displayName: string;
  readonly iconUrl: string;
}

export interface StorageBackend extends StorageBackendInfo {
  isAuthenticated(): boolean;
  getAuthenticationUrl(): Promise<string>;
  get(taskListId: string): Promise<any | null>;
  save(taskListId: string, taskListState: any): Promise<void>;
  list(): Promise<string[]>;
}
