import hyperactiv from 'hyperactiv'
const { observe } = hyperactiv

export const state = observe({
    taskLists: {
        // 'localStorage/main': {
        //     tasks: [],
        //     selectedTaskIndex: null,
        // },
    },
    storageStatus: {
        // 'localStorage/main': 'saved'
    }
})
