import js.Browser;
class Main {
    static function main() {
        var button = Browser.document.createButtonElement();
        button.textContent = "Click me!";
        button.onclick = function(event) {
            Browser.alert("Haxe is osom");
        }
        Browser.document.body.appendChild(button);
    }
}
