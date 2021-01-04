package test.vendor;

typedef Expecter = {
    function toEqual(obj: Any): Void;
}

@:native("window")
extern class Jasmine {
    static function expect(obj: Any): Expecter;
}
