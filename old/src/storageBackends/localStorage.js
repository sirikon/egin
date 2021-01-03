export function get(taskListId) {
    return new Promise((resolve) => {
        const data = localStorage.getItem(storageKey(taskListId))
        resolve(data !== null ? JSON.parse(data) : null);
    })
}

export function save(taskListId, taskListState) {
    return new Promise((resolve) => {
        resolve(localStorage.setItem(storageKey(taskListId), JSON.stringify(taskListState)))
    })
}

export function list() {
    return new Promise((resolve) => {
        resolve(Object.keys(localStorage)
            .filter(k => k.indexOf("egin_tasklist_") === 0)
            .map(k => k.substr("egin_tasklist_".length)))
    })
}

const storageKey = (taskListId) => `egin_tasklist_${taskListId}`;
