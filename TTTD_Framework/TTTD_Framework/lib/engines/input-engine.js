(function (namespace, undefined) {
    "use strict";

    namespace.Engines = namespace.Engines || {};
    namespace.Engines.InputManager = function () {
        var messengerEngine = namespace.Globals.globalMessengerEngine;

        var that = this;

        this.keys = {
            arrowLeft: 37,
            arrowUp: 38,
            arrowRight: 39,
            arrowDown: 40,
            backspace: 8,
            enter: 13,
            escape: 27,
            shift: 16,
            space: 32,
            tilde: 192,

            a: 65,
            d: 68,
            i: 73,
            j: 74,
            k: 75,
            l: 76,
            s: 83,
            w: 87,
            z: 90,
            0: 48,
            9: 57,
        };

        this.characters = [];
        this.characters[65] = 'a';
        this.characters[66] = 'b';
        this.characters[67] = 'c';
        this.characters[68] = 'd';
        this.characters[69] = 'e';
        this.characters[70] = 'f';
        this.characters[71] = 'g';
        this.characters[72] = 'h';
        this.characters[73] = 'i';
        this.characters[74] = 'j';
        this.characters[75] = 'k';
        this.characters[76] = 'l';
        this.characters[77] = 'm';
        this.characters[78] = 'n';
        this.characters[79] = 'o';
        this.characters[80] = 'p';
        this.characters[81] = 'q';
        this.characters[82] = 'r';
        this.characters[83] = 's';
        this.characters[84] = 't';
        this.characters[85] = 'u';
        this.characters[86] = 'v';
        this.characters[87] = 'w';
        this.characters[88] = 'x';
        this.characters[89] = 'y';
        this.characters[90] = 'z';
        this.characters[48] = '0';
        this.characters[49] = '1';
        this.characters[50] = '2';
        this.characters[51] = '3';
        this.characters[52] = '4';
        this.characters[53] = '5';
        this.characters[54] = '6';
        this.characters[55] = '7';
        this.characters[56] = '8';
        this.characters[57] = '9';
        this.characters[188] = ',';
        this.characters[190] = '.';
        this.characters[191] = '/';
        this.characters[186] = ';';
        this.characters[222] = "'";
        this.characters[219] = '[';
        this.characters[221] = ']';
        this.characters[220] = '\\';
        this.characters[192] = '`';
        this.characters[189] = '-';
        this.characters[187] = '=';
        this.characters[32] = ' ';
    
        this.shiftedCharacters = [];
        this.shiftedCharacters[65] = 'A';
        this.shiftedCharacters[66] = 'B';
        this.shiftedCharacters[67] = 'C';
        this.shiftedCharacters[68] = 'D';
        this.shiftedCharacters[69] = 'E';
        this.shiftedCharacters[70] = 'G';
        this.shiftedCharacters[71] = 'G';
        this.shiftedCharacters[72] = 'H';
        this.shiftedCharacters[73] = 'I';
        this.shiftedCharacters[74] = 'J';
        this.shiftedCharacters[75] = 'K';
        this.shiftedCharacters[76] = 'L';
        this.shiftedCharacters[77] = 'M';
        this.shiftedCharacters[78] = 'N';
        this.shiftedCharacters[79] = 'O';
        this.shiftedCharacters[80] = 'P';
        this.shiftedCharacters[81] = 'Q';
        this.shiftedCharacters[82] = 'R';
        this.shiftedCharacters[83] = 'S';
        this.shiftedCharacters[84] = 'T';
        this.shiftedCharacters[85] = 'U';
        this.shiftedCharacters[86] = 'V';
        this.shiftedCharacters[87] = 'W';
        this.shiftedCharacters[88] = 'X';
        this.shiftedCharacters[89] = 'Y';
        this.shiftedCharacters[90] = 'Z';
        this.shiftedCharacters[48] = ')';
        this.shiftedCharacters[49] = '!';
        this.shiftedCharacters[50] = '@';
        this.shiftedCharacters[51] = '#';
        this.shiftedCharacters[52] = '$';
        this.shiftedCharacters[53] = '%';
        this.shiftedCharacters[54] = '^';
        this.shiftedCharacters[55] = '&';
        this.shiftedCharacters[56] = '*';
        this.shiftedCharacters[57] = '(';
        this.shiftedCharacters[188] = '<';
        this.shiftedCharacters[190] = '>';
        this.shiftedCharacters[191] = '?';
        this.shiftedCharacters[186] = ':';
        this.shiftedCharacters[222] = '"';
        this.shiftedCharacters[219] = '{';
        this.shiftedCharacters[221] = '}';
        this.shiftedCharacters[220] = '|';
        this.shiftedCharacters[192] = '~';
        this.shiftedCharacters[189] = '_';
        this.shiftedCharacters[187] = '+';
        this.shiftedCharacters[32] = ' ';

        var pressedArrayTemp = {};
        var triggeredArrayTemp = {};

        var pressedArray = {};
        var triggeredArray = {};

        var triggeredArrayAccepting = {};

        var rect = null;
        var mouseClickedTemp = false;
        var mouseClicked = false;
        var mouseHeld = false;
        var mouseHeldCounter = null;
        var mouseHeldThreshold = 250;
        var mousePosition = null;

        var updateFunction;

        var keydownEvent = function (event) {
            pressedArrayTemp[event.keyCode] = true;
            if (triggeredArrayAccepting[event.keyCode] === undefined || triggeredArrayAccepting[event.keyCode] === true) {
                triggeredArrayTemp[event.keyCode] = true;
                triggeredArrayAccepting[event.keyCode] = false;
            }
        };
   
        var keyupEvent = function (event) {
            pressedArrayTemp[event.keyCode] = false;
            triggeredArrayTemp[event.keyCode] = false;
            triggeredArrayAccepting[event.keyCode] = true;
        };

        var mouseDownEvent = function (event) {
            mouseClickedTemp = true;
            mousePosition = new namespace.Math.Vector2D(event.clientX - rect.left, event.clientY - rect.top);
        };

        var mouseUpEvent = function (event) {
            mouseClickedTemp = false;
            mouseClicked = false;
            mouseHeld = false;
            mouseHeldCounter = null;
            mousePosition = null;
        };

        this.isPressed = function (keyCode) {
            return pressedArray[keyCode] !== undefined && pressedArray[keyCode];
        };

        this.isTriggered = function (keyCode) {
            return triggeredArray[keyCode] !== undefined && triggeredArray[keyCode];
        };

        this.isAnyPressed = function () {
            var is = pressedArray.forOwnProperties(function (key, value) {
                if (value === true) {
                    return true;
                }
            });
            return (is !== undefined) ? is : false;
        };

        this.isAnyTriggered = function () {
            var is = triggeredArray.forOwnProperties(function (key, value) {
                if (value === true) {
                    return true;
                }
            });
            return (is !== undefined) ? is : false;
        };

        this.isAnyPressedOrTriggered = function () {
            return this.isAnyPressed() || this.isAnyTriggered();
        };

        this.getFirstTriggered = function () {
            var first = triggeredArray.forOwnProperties(function (key, value) {
                if (value === true) {
                    return key;
                }
            });
            
            return (first !== undefined) ? first : null;
        };

        this.isMouseClicked = function () {
            return mouseClicked;
        };

        this.isMouseHeld = function () {
            return mouseHeld;
        };

        this.getMousePosition = function () {
            return mousePosition;
        };

        this.isCharacter = function (keyCode) {
            return this.characters[keyCode] != null;
        };

        this.toCharacter = function (keyCode) {
            return this.characters[keyCode];
        };

        this.toShiftedCharacter = function (keyCode) {
            return this.shiftedCharacters[keyCode];
        };

        this.init = function (canvas) {
            return new Promise(function (resolve, reject) {
                rect = canvas.getBoundingClientRect();
                if (window.addEventListener != null) {
                    window.addEventListener("keydown", keydownEvent);
                    window.addEventListener("keyup", keyupEvent);
                    canvas.onmousedown = mouseDownEvent;
                    canvas.onmouseup = mouseUpEvent;
                    resolve();
                } else {
                    reject("Browser does not support window.addEventListener");
                }
            });
        };

        this.shutdown = function (canvas) {
            return new Promise(function (resolve, reject) {
                if (window.removeEventListener != null) {
                    window.removeEventListener("keydown", keydownEvent);
                    window.removeEventListener("keyup", keyupEvent);
                    canvas.onmousedown = null;
                    canvas.onmouseup = null;
                    messengerEngine.unregisterObject(that);
                    resolve();
                } else {
                    reject("Browser does not support window.removeEventListener");
                }
            });
        }

        var enabledUpdate = function (delta) {
            var i;
            for (i in pressedArrayTemp) {
                pressedArray[i] = pressedArrayTemp[i];
            }

            for (i in triggeredArrayTemp) {
                if (triggeredArray[i] === undefined) {
                    triggeredArray[i] = triggeredArrayTemp[i];
                } else if (triggeredArray[i] === false && triggeredArrayTemp[i] === true) {
                    triggeredArray[i] = true;
                    triggeredArrayTemp[i] = false;
                } else {
                    triggeredArray[i] = false;
                    triggeredArrayTemp[i] = false;
                }
            }

            // this HAS to be explicit, and not truthiness
            // mouseHeldCounter is only !== null after mouseClickedTemp === true; after onmouseup, it becomes null again
            if (mouseHeldCounter !== null && mouseHeld === false) {
                mouseHeldCounter += delta;
                if (mouseHeldCounter >= mouseHeldThreshold) {
                    mouseHeld = true;
                }
            }
            if (mouseHeld === true) {
                messengerEngine.postNotice("setMouseHeldCollider", {
                    point: that.getMousePosition()
                });
            }

            // check for initial click AFTER checking to update the held counter
            if (mouseClickedTemp === true) {
                mouseClickedTemp = false;
                mouseClicked = true;
                mouseHeldCounter = 1;
                messengerEngine.postNotice("setMouseClickCollider", {
                    point: that.getMousePosition()
                });
            } else if (mouseClicked === true) {
                // we've been true for a frame, so it's back to false until we click again
                mouseClicked = true;
            }
        };

        var disabledUpdate = function (delta) {
            var i;
            for (i in pressedArrayTemp) {
                pressedArray[i] = false;
            }

            for (i in triggeredArrayTemp) {
                    triggeredArray[i] = false;
            }

            mouseClickedTemp = false;
            mouseClicked = false;
            mouseHeld = false;
            mousePosition = null;
        };

        this.update = function (delta) {
            updateFunction(delta);
        };

        this.enable = function () {
            updateFunction = enabledUpdate;
        };

        this.disable = function () {
            updateFunction = disabledUpdate;
        };

        updateFunction = enabledUpdate;

    };

    namespace.Globals = namespace.Globals || {};
    namespace.Globals.globalInputEngine = new namespace.Engines.InputManager();

}(window.TTTD = window.TTTD || {}));