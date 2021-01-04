package test.utils;

typedef MockTask = {
    var name: String;
    var done: Bool;
    var children: Array<MockTask>;
}
