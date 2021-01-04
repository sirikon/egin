package test;

import test.specs.ActionsSpec;
import test.specs.TaskStoreSpec;

@:expose
class Spec
{
    static final testClasses:Array<Dynamic> = [
        ActionsSpec,
        TaskStoreSpec,
    ];

    static function main() {}
}
