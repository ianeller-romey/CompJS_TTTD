var CHEAT = globalMessengerEngine.queueForPosting;

(function () {
    "use strict";

    var init = function () {
        var acceptInput = false;

        var cheatsElemHeight = "150px";
        var cheatsElem = document.createElement("div");
        cheatsElem.classList.add("transition150");
        cheatsElem.classList.add("center");
        cheatsElem.style.position = "relative"; 
        cheatsElem.style.top = 0;
        cheatsElem.style.height = "0px"; 
        cheatsElem.style.width = "624px";
        cheatsElem.style.background = "darkgray";
        cheatsElem.style.color = "black";
        cheatsElem.style["font-family"] = "Courier New";
        cheatsElem.style["overflow-y"] = "auto"
        cheatsElem.style.opacity = .75;
        document.body.appendChild(cheatsElem);

        var ConsoleInputManager = function () {
            this.resetConsoleInput = function () {
                return this.addCharToConsoleInput("", "");
            };

            this.addCharToConsoleInput = function (add, str) {
                return str.substring(0, str.length - 1) + add + '_';
            };

            this.deleteCharFromConsoleInput = function (str) {
                return str.substring(0, str.length - 2) + '_';
            };

            this.setConsoleInput = function (setStr) {
                return setStr + '_';
            };
        };

        var lastActiveCommand = "";
        var inputManager = globalInputManager;
        var consoleInputManager = new ConsoleInputManager();
        cheatsElem.innerHTML = consoleInputManager.resetConsoleInput();

        function updateConsoleInput(keyCode) {
            if (keyCode === inputManager.keys.backspace) { // delete characters if the delete key is pressed
                cheatsElem.innerHTML = consoleInputManager.deleteCharFromConsoleInput(cheatsElem.innerHTML);
            } else if (event.keyCode === inputManager.keys.enter) { // parse characters if the enter key is pressed
                var str = cheatsElem.innerHTML.substring(0, cheatsElem.innerHTML.length - 1);
                try {
                    eval(str);
                }
                catch (err) {
                    // TODO: notify error
                }
                lastActiveCommand = str;
                cheatsElem.innerHTML = consoleInputManager.resetConsoleInput();
            } else { // otherwise, add characters
                if (inputManager.isCharacter(keyCode)) {
                    var char = (inputManager.isPressed(inputManager.keys.shift)) ? inputManager.toShiftedCharacter(keyCode) : inputManager.toCharacter(keyCode);
                    cheatsElem.innerHTML = consoleInputManager.addCharToConsoleInput(char, cheatsElem.innerHTML);
                }
            }
        };
        window.addEventListener("keydown", function (event) {
            if (event.keyCode === inputManager.keys.arrowUp) {
                cheatsElem.innerHTML = consoleInputManager.setConsoleInput(lastActiveCommand);
            } else if (event.keyCode === inputManager.keys.tilde) { // tilde
                if (cheatsElem.style.height != cheatsElemHeight) {
                    cheatsElem.style.height = cheatsElemHeight;
                    cheatsElem.style.padding = "8px";
                    acceptInput = true;
                    //globalInputManager.disable();
                } else {
                    cheatsElem.style.height = 0;
                    cheatsElem.style.padding = "0px";
                    acceptInput = false;
                    //globalInputManager.enable();
                }
            } else {
                if (acceptInput) {
                    updateConsoleInput(event.keyCode);
                }
            }
        });
    };

    window.addEventListener("load", function load(event) {
        window.removeEventListener("load", load, false);
        init();
    }, false);

}());