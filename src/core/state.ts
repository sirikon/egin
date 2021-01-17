import hyperactiv from 'hyperactiv'
const { observe } = hyperactiv

import { State } from './models';

export const state: State = observe({
    taskLists: {},
    storageStatus: {}
} as State)
