import hyperactiv from 'hyperactiv'
const { observe } = hyperactiv

import { State } from './models';

const state: State = observe({
    taskLists: {},
    storageStatus: {}
} as State)
export default state;
