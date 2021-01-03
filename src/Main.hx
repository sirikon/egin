import js.Browser;
class Main {
    static function main() {
        var count = 0;
        var button = Browser.document.createButtonElement();
        button.textContent = "Click me!";
        button.onclick = function(event) {
            Browser.alert("Haxe is " + count++);
        }
        Browser.document.body.appendChild(button);
    }
}
