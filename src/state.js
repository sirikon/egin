const {BehaviorSubject} = imports.libs.rxjs.rxjs;

var state = {
    tasks: new BehaviorSubject([
        { id: 1, text: "Amaze", done: true },
        { id: 2, text: "Amaze again", done: false }
    ])
}
