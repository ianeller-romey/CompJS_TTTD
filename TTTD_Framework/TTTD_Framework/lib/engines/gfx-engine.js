(function (namespace, undefined) {
    "use strict";

    ////////
    // VERTICES
    if (VERTICES === undefined) {
        // these don't need to be Vector2D's
        var VERTICES = [{
            x: 0.0,
            y: 0.0
        }, {
            x: 1.0,
            y: 0.0
        }, {
            x: 0.0,
            y: 1.0
        }, {
            x: 0.0,
            y: 1.0
        }, {
            x: 1.0,
            y: 0.0
        }, {
            x: 1.0,
            y: 1.0
        }];
    }

    ////////
    // FONT_DICTIONARY
    if (FONT_DICTIONARY === undefined) {
        var FONT_DICTIONARY = {
            a: {
                column: 0,
                row: 0
            },
            b: {
                column: 1,
                row: 0
            },
            c: {
                column: 2,
                row: 0
            },
            d: {
                column: 3,
                row: 0
            },
            e: {
                column: 4,
                row: 0
            },
            f: {
                column: 5,
                row: 0
            },
            g: {
                column: 6,
                row: 0
            },
            h: {
                column: 7,
                row: 0
            },
            i: {
                column: 8,
                row: 0
            },
            j: {
                column: 9,
                row: 0
            },
            k: {
                column: 10,
                row: 0
            },
            l: {
                column: 11,
                row: 0
            },
            m: {
                column: 12,
                row: 0
            },
            n: {
                column: 13,
                row: 0
            },
            o: {
                column: 14,
                row: 0
            },
            p: {
                column: 15,
                row: 0
            },
            q: {
                column: 16,
                row: 0
            },
            r: {
                column: 17,
                row: 0
            },
            s: {
                column: 18,
                row: 0
            },
            t: {
                column: 19,
                row: 0
            },
            u: {
                column: 20,
                row: 0
            },
            v: {
                column: 21,
                row: 0
            },
            w: {
                column: 22,
                row: 0
            },
            x: {
                column: 23,
                row: 0
            },
            y: {
                column: 24,
                row: 0
            },
            z: {
                column: 25,
                row: 0
            },
            A: {
                column: 0,
                row: 1
            },
            B: {
                column: 1,
                row: 1
            },
            C: {
                column: 2,
                row: 1
            },
            D: {
                column: 3,
                row: 1
            },
            E: {
                column: 4,
                row: 1
            },
            F: {
                column: 5,
                row: 1
            },
            G: {
                column: 6,
                row: 1
            },
            H: {
                column: 7,
                row: 1
            },
            I: {
                column: 8,
                row: 1
            },
            J: {
                column: 9,
                row: 1
            },
            K: {
                column: 10,
                row: 1
            },
            L: {
                column: 11,
                row: 1
            },
            M: {
                column: 12,
                row: 1
            },
            N: {
                column: 13,
                row: 1
            },
            O: {
                column: 14,
                row: 1
            },
            P: {
                column: 15,
                row: 1
            },
            Q: {
                column: 16,
                row: 1
            },
            R: {
                column: 17,
                row: 1
            },
            S: {
                column: 18,
                row: 1
            },
            T: {
                column: 19,
                row: 1
            },
            U: {
                column: 20,
                row: 1
            },
            V: {
                column: 21,
                row: 1
            },
            W: {
                column: 22,
                row: 1
            },
            X: {
                column: 23,
                row: 1
            },
            Y: {
                column: 24,
                row: 1
            },
            Z: {
                column: 25,
                row: 1
            },
            "1": {
                column: 0,
                row: 2
            },
            "2": {
                column: 1,
                row: 2
            },
            "3": {
                column: 2,
                row: 2
            },
            "4": {
                column: 3,
                row: 2
            },
            "5": {
                column: 4,
                row: 2
            },
            "6": {
                column: 5,
                row: 2
            },
            "7": {
                column: 6,
                row: 2
            },
            "8": {
                column: 7,
                row: 2
            },
            "9": {
                column: 8,
                row: 2
            },
            "0": {
                column: 9,
                row: 2
            },
            " ": {
                column: 10,
                row: 2
            },
            ",": {
                column: 0,
                row: 3
            },
            ".": {
                column: 1,
                row: 3
            },
            "/": {
                column: 2,
                row: 3
            },
            "<": {
                column: 3,
                row: 3
            },
            ">": {
                column: 4,
                row: 3
            },
            "?": {
                column: 5,
                row: 3
            },
            ";": {
                column: 6,
                row: 3
            },
            "'": {
                column: 7,
                row: 3
            },
            ":": {
                column: 8,
                row: 3
            },
            '"': {
                column: 9,
                row: 3
            },
            "[": {
                column: 10,
                row: 3
            },
            "]": {
                column: 11,
                row: 3
            },
            "\\": {
                column: 12,
                row: 3
            },
            "{": {
                column: 13,
                row: 3
            },
            "}": {
                column: 14,
                row: 3
            },
            "|": {
                column: 15,
                row: 3
            },
            "`": {
                column: 16,
                row: 3
            },
            "-": {
                column: 17,
                row: 3
            },
            "=": {
                column: 18,
                row: 3
            },
            "~": {
                column: 19,
                row: 3
            },
            "!": {
                column: 20,
                row: 3
            },
            "@": {
                column: 21,
                row: 3
            },
            "#": {
                column: 22,
                row: 3
            },
            "$": {
                column: 23,
                row: 3
            },
            "%": {
                column: 24,
                row: 3
            },
            "^": {
                column: 25,
                row: 3
            },
            "&": {
                column: 26,
                row: 3
            },
            "*": {
                column: 27,
                row: 3
            },
            "(": {
                column: 28,
                row: 3
            },
            ")": {
                column: 29,
                row: 3
            },
            "_": {
                column: 30,
                row: 3
            },
            "+": {
                column: 31,
                row: 3
            }
        };
    }

    ////////
    // GfxCompInst_2DAnimation
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Gfx2DAnim = function (entity, gfxCompDefId, width, height) {
        this.instanceId = entity.instanceId;
        this.instanceDefinitionName = entity.instanceDefinitionName;
        this.transformation = entity.transformation;
        this.graphics = new namespace.Comp.Inst.Gfx2DAnim.Graphics(gfxCompDefId, width, height, this.transformation);
    };

    namespace.Comp.Inst.Gfx2DAnim.prototype = new namespace.Comp.Inst.Component();
    
    namespace.Comp.Inst.Gfx2DAnim.Graphics = function (gfxCompDefId, width, height, transformation) {
        this.id = gfxCompDefId;
        this.animationState = 0;
        this.animationFrame = 0;
        this.currentDuration = 0;
        this.width = width;
        this.height = height;
        this.vertices = new Array(VERTICES.length);
        this.textureCoords = [];

        var that = this;

        var init = function () {
            VERTICES.forEach(function (vert, i) {
                var scaled = new namespace.Math.Vector2D(vert.x * that.width * transformation.scale.x, vert.y * that.height * transformation.scale.y);
                that.vertices[i] = new namespace.Math.Vector2D(scaled.x + transformation.position.x, scaled.y + transformation.position.y);
            });
        };

        this.update = function () {
            if (transformation.scaleChanged() && !transformation.positionChanged()) { // new scale, no translation
                //if (transformation.scale.x !== 1 || transformation.scale.y !== 1) {
                    VERTICES.forEach(function (vert, i) {
                        var scaled = new namespace.Math.Vector2D(vert.x * that.width * transformation.scale.x, vert.y * that.height * transformation.scale.y);
                        that.vertices[i].x = scaled.x + transformation.position.x;
                        that.vertices[i].y = scaled.y + transformation.position.y;
                    });
                //}
            } else if (!transformation.scaleChanged() && transformation.positionChanged()) { // no scale, new translation
                var translation = transformation.getPositionChange();
                VERTICES.forEach(function (vert, i) {
                    that.vertices[i].translateSelf(translation.x, translation.y);
                });
            }  else if (transformation.scaleChanged() && transformation.positionChanged()) { // new scale, new translation
                var translation = transformation.getPositionChange();
                VERTICES.forEach(function (vert, i) {
                    var scaled = new namespace.Math.Vector2D(vert.x * that.width * transformation.scale.x, vert.y * that.height * transformation.scale.y);
                    that.vertices[i].x = scaled.x + transformation.position.x;
                    that.vertices[i].y = scaled.y + transformation.position.y;
                    that.vertices[i].translateSelf(translation.x, translation.y);
                });
            }

            if (transformation.rotationChanged()) {
                var theta = transformation.getRotationChange();
                var origin = transformation.position.translate(that.width / 2, that.height / 2);

                for(var i = 0; i < VERTICES.length; ++i) {
                    that.vertices[i].rotateSelf(origin.x, origin.y, theta);
                }
            }
        };

        init();
    };

    namespace.Comp.Inst.Gfx2DAnim.Graphics.prototype.setTextureCoords = function (t, r, b, l) {
        var top = arguments[0];
        var rgt = arguments[1];
        var bot = arguments[2];
        var lft = arguments[3];
        this.textureCoords = [lft, top,
                lft + (rgt - lft), top,
                              lft, top + (bot - top),
                              lft, top + (bot - top),
                lft + (rgt - lft), top,
                lft + (rgt - lft), top + (bot - top)];
    };

    ////////
    // GfxCompInst_Font
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.GfxFont = function (entity, gfxCompDefId, fontTextureDefinition, text) {
        this.instanceId = entity.instanceId;
        this.instanceDefinitionName = entity.instanceDefinitionName;
        this.transformation = entity.transformation;
        this.graphics = new namespace.Comp.Inst.GfxFont.Graphics(gfxCompDefId, fontTextureDefinition.startTop, fontTextureDefinition.startLeft, fontTextureDefinition.characterWidth, fontTextureDefinition.characterHeight, fontTextureDefinition.textureWidth, text, this.transformation);
    };

    namespace.Comp.Inst.GfxFont.prototype = new namespace.Comp.Inst.Component();

    namespace.Comp.Inst.GfxFont.Graphics = function (gfxCompDefId, startTop, startLeft, characterWidth, characterHeight, textureWidth, initialText, transformation) {
        this.id = gfxCompDefId;
        this.textureWidth = textureWidth;
        this.startTop = startTop;
        this.startLeft = startLeft;
        this.characterWidth = characterWidth;
        this.characterHeight = characterHeight;
        this.vertices = new Array();
        this.textureCoords = new Array();
        this.text = new String();

        var that = this;

        var scaleTranslateVertices = function () {
            var yOff = 0;
            var xOff = 0;
            for (var letter = 0; letter < that.text.length; ++letter, ++xOff) {
                if (that.text[letter] === "\n") {
                    yOff += that.characterHeight;
                    xOff = -1;
                }
                VERTICES.forEach(function (vert, i) {
                    var scaled = new namespace.Math.Vector2D(vert.x * that.characterWidth * transformation.scale.x, vert.y * that.characterHeight * transformation.scale.y);
                    that.vertices[letter][i].x = scaled.x + (transformation.position.x) + (xOff * that.characterWidth * transformation.scale.x);
                    that.vertices[letter][i].y = scaled.y + (transformation.position.y) + (yOff * transformation.scale.y);
                });
            }
        };

        var rotateVertices = function () {
            var theta = transformation.getRotationChange();
            if (theta === 0) {
                return;
            }

            var dimensions = that.text.dimensions();
            dimensions.x *= that.characterWidth;
            dimensions.y *= that.characterHeight;
            var origin = transformation.position.translate(dimensions.x / 2, dimensions.y / 2);
            for (var letter = 0; letter < that.text.length; ++letter) {
                VERTICES.forEach(function (vert, i) {
                    that.vertices[letter][i].rotateSelf(origin.x, origin.y, theta);
                });
            }
        };

        var calculateTextureCoordinates = function (pixel) {
            return (2 * pixel + 1) / (2 * that.textureWidth);
        };

        var updateTextureCoords = function () {
            for (var i = 0; i < that.textureCoords.length; ++i) {
                var letter = that.text[i];
                if (letter === "\n") {
                    letter = " ";
                }
                var xOff = that.startLeft + (FONT_DICTIONARY[letter].column * that.characterWidth);
                var yOff = that.startTop + (FONT_DICTIONARY[letter].row * that.characterHeight);

                /*var texturePixelVerts = [lft, top,
                                            rgt, top,
                                            lft, bot,
                                            lft, bot,
                                            rgt, top,
                                            rgt, bot];*/

                that.textureCoords[i][0].x = calculateTextureCoordinates(xOff + .5);
                that.textureCoords[i][0].y = calculateTextureCoordinates(yOff + .5);

                that.textureCoords[i][1].x = calculateTextureCoordinates(xOff + that.characterWidth - .5);
                that.textureCoords[i][1].y = calculateTextureCoordinates(yOff + .5);

                that.textureCoords[i][2].x = calculateTextureCoordinates(xOff + .5);
                that.textureCoords[i][2].y = calculateTextureCoordinates(yOff + that.characterHeight - .5);

                that.textureCoords[i][3].x = calculateTextureCoordinates(xOff + .5);
                that.textureCoords[i][3].y = calculateTextureCoordinates(yOff + that.characterHeight - .5);

                that.textureCoords[i][4].x = calculateTextureCoordinates(xOff + that.characterWidth - .5);
                that.textureCoords[i][4].y = calculateTextureCoordinates(yOff + .5);

                that.textureCoords[i][5].x = calculateTextureCoordinates(xOff + that.characterWidth - .5);
                that.textureCoords[i][5].y = calculateTextureCoordinates(yOff + that.characterHeight - .5);

            }
        };

        this.updateText = function (newText) {
            that.text = newText;
            while (that.vertices.length < that.text.length) {
                var i = that.vertices.push(new Array(VERTICES.length));
                --i;
                var j = that.textureCoords.push(new Array(VERTICES.length));
                --j;
                VERTICES.forEach(function (vert, k) {
                    // we'll set the acutal vector values later, so we can initialize to 0
                    that.vertices[i][k] = new namespace.Math.Vector2D(0, 0);
                    that.textureCoords[j][k] = new namespace.Math.Vector2D(0, 0);
                });
            }
            while (that.vertices.length > that.text.length) {
                that.vertices.pop();
                that.textureCoords.pop();
            }
            scaleTranslateVertices();
            rotateVertices();
            updateTextureCoords();
        };

        this.update = function () {
            if (transformation.scaleChanged() && !transformation.positionChanged()) { // new scale, no translation
                scaleTranslateVertices();
                rotateVertices();
            } else if (!transformation.scaleChanged() && transformation.positionChanged()) { // no scale, new translation
                var translation = transformation.getPositionChange();
                for (var letter = 0; letter < that.text.length; ++letter) {
                    VERTICES.forEach(function (vert, i) {
                        that.vertices[letter][i].translateSelf(translation.x, translation.y);
                    });
                }
                if (transformation.rotationChanged()) {
                    rotateVertices();
                }
            } else if (transformation.scaleChanged() && transformation.positionChanged()) { // new scale, new translation
                scaleTranslateVertices();
                rotateVertices();
            } else if (transformation.rotationChanged()) { // only rotation changed
                rotateVertices();
            }
        };

        var init = function (text) {
            that.updateText(text);
        };

        init(initialText);
    };

    ////////
    // Gfx2DAnimDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.GraphicsAnimationFrame = function (def) {
        this.id = def.id;
        this.duration = def.duration;
        this.texture = def.texture;
        this.width = def.width;
        this.height = def.height;
        this.texCoordTop = def.texCoordTop;
        this.texCoordRight = def.texCoordRight;
        this.texCoordBottom = def.texCoordBottom;
        this.texCoordLeft = def.texCoordLeft;
    };

    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.GraphicsAnimationState = function (def) {
        var Def = namespace.Comp.Def;

        this.id = def.id;
        this.animationFrameDefinitions = [];

        for (var j = 0; j < def.animationFrameDefinitions.length; ++j) {
            var animationFrame = def.animationFrameDefinitions[j];
            this.animationFrameDefinitions[animationFrame.frame] = new Def.GraphicsAnimationFrame(animationFrame);
        }
    };

    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.GraphicsAnimation = function (def) {
        var Def = namespace.Comp.Def;

        this.zOrder = def.zOrder;
        this.renderPass = def.renderPass;
        this.animationStateDefinitions = [];

        for (var i = 0; i < def.animationStateDefinitions.length; ++i) {
            var animationState = def.animationStateDefinitions[i];
            this.animationStateDefinitions[animationState.state] = new Def.GraphicsAnimationState(animationState);
        }
    };

    ////////
    // FontDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.GraphicsFontTexture = function (def) {
        this.id = def.id;
        this.texture = def.texture;
        this.textureWidth = def.textureWidth;
        this.startTop = def.startTop;
        this.startLeft = def.startLeft;
        this.characterWidth = def.characterWidth;
        this.characterHeight = def.characterHeight;
    };

    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.GraphicsFont = function (def) {
        var Def = namespace.Comp.Def;

        this.zOrder = def.zOrder;
        this.renderPass = def.renderPass;
        this.fontTextureDefinition = new Def.GraphicsFontTexture(def.singleFontTextureDefinition);
    };

    ////////
    // GfxEngine
    namespace.Engines = namespace.Engines || {};
    namespace.Engines.GfxEngine = function (canvasElem) {
        var Inst = namespace.Comp.Inst;
        var Def = namespace.Comp.Def;

        var messengerEngine = namespace.Globals.globalMessengerEngine;
        var dataEngine = namespace.Globals.globalDataEngine;
        var gameStateEngine = namespace.Globals.globalGameStateEngine;

        var textureInformation = {};
        var gfx2DAnimationDefinitions = [];
        var gfxFontDefinitions = [];
        var zOrders = [];
        var renderPasses = [0, 1];
        var gfxGameStates = {};
        var gfxCompTypeDefinitions = {};
        var gfxCompType2DAnimation = "2DAnimation";
        var gfxCompTypeFont = "Font";

        var shaderList = namespace.Engines.GfxEngine.shaderList;

        var webGL;
        var webGLShaderPrograms = [];
        var webGLVertexShaderExtraSteps = [];
        var webGLFragmentShaderExtraSteps = [];
        var webGLSquareVerticesBuffer;
        var webGLTexCoordBuffer;

        var width = 640;
        var height = 480;
        var activeTexture = "";

        var initWebGL = function (canvas) {
            try {
                webGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            }
            catch (e) {
            }

            if (!webGL) {
                webGL = null;
            }

            return (webGL) ? true : false;
        };

        var initShaders = function () {
            for (var i = 0; i < shaderList.length; ++i) {
                shaderList[i].init(webGL, i);
                if (shaderList[i] === null) {
                    return false;
                }
            }
            return true;
        };

        var initBuffers = function () {
            webGLSquareVerticesBuffer = webGL.createBuffer();
            webGLTexCoordBuffer = webGL.createBuffer();
        };

        var addZOrder = function (zOrder) {
            if (!zOrders.contains(zOrder)) {
                zOrders.push(zOrder);
            }
            gfxGameStates.forOwnProperties(function (key, value) {
                value.addZOrder(zOrder);
            });
        };

        var addRenderPass = function (renderPass) {
            if (!renderPasses.contains(renderPass)) {
                renderPasses.push(renderPass);
            }
            gfxGameStates.forOwnProperties(function (key, value) {
                value.addRenderPass(renderPass);
            });
        };

        var buildGraphicsAnimationInstanceDefinitions = function (data) {
            data.forEach(function (x) {
                addZOrder(x.zOrder);
                addRenderPass(x.renderPass);
                
                gfx2DAnimationDefinitions[x.id] = new Def.GraphicsAnimation(x);
                gfxCompTypeDefinitions[x.id] = gfxCompType2DAnimation;
            });
        };

        var buildGraphicsFontInstanceDefinitions = function (data) {
            data.forEach(function (x) {
                addZOrder(x.zOrder);
                addRenderPass(x.renderPass);

                gfxFontDefinitions[x.id] = new Def.GraphicsFont(x);
                gfxCompTypeDefinitions[x.id] = gfxCompTypeFont;
            });
        };

        var buildTextureInformation = function (data) {
            var createWebGLTexture = function (image, webGLTexture) {
                var promise = new Promise(function (resolve, reject) {
                    image.addEventListener("load", function () {
                        webGL.bindTexture(webGL.TEXTURE_2D, webGLTexture);

                        // Set the parameters so we can render any size image
                        webGL.texParameterf(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_S, webGL.CLAMP_TO_EDGE);
                        webGL.texParameterf(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_T, webGL.CLAMP_TO_EDGE);
                        webGL.texParameterf(webGL.TEXTURE_2D, webGL.TEXTURE_MIN_FILTER, webGL.NEAREST);
                        webGL.texParameterf(webGL.TEXTURE_2D, webGL.TEXTURE_MAG_FILTER, webGL.NEAREST);

                        webGL.texImage2D(webGL.TEXTURE_2D, 0, webGL.RGBA, webGL.RGBA, webGL.UNSIGNED_BYTE, image);

                        resolve();
                    });
                });

                return promise;
            };

            var loadImagePromises = [];
            for (var i = 0; i < data.length; ++i) {
                var ti = data[i];
                if (textureInformation[ti.texture] === undefined) {
                    var image = new Image();
                    var webGLTexture = webGL.createTexture();
                    textureInformation[ti.texture] = {
                        image: image,
                        webGLTexture: webGLTexture,
                        width: ti.textureWidth,
                        height: ti.textureHeight,
                        stepX: ti.stepX,
                        stepY: ti.stepY
                    };

                    var promise = createWebGLTexture(image, webGLTexture);
                    loadImagePromises.push(promise);

                    image.src = ti.texture;
                }
            }
            return Promise.all(loadImagePromises);
        };

        this.init = function () {
            var that = this;
            gameStateEngine.getActiveGfxGameStates().forEach(function (gameState) {
                addGameState(gameState);
            });

            var webGLPromise = new Promise(function (resolve, reject) {
                canvasElem.width = width;
                canvasElem.height = height;
                if (initWebGL(canvasElem)) {
                    initShaders();
                    initBuffers();

                    webGL.clearColor(0.0, 0.0, 0.0, 0.0);
                    webGL.clear(webGL.COLOR_BUFFER_BIT | webGL.DEPTH_BUFFER_BIT);
                    webGL.enable(webGL.BLEND);
                    webGL.blendFunc(webGL.SRC_ALPHA, webGL.ONE_MINUS_SRC_ALPHA);
                    //webGL.viewport(0, 0, width, height);

                    resolve();
                } else {
                    reject("Failed to initialize WebGL");
                }
            });
            var graphicsInstanceDefinitionsPromise = new Promise(function (resolve, reject) {
                dataEngine.loadAllGraphicsInstanceDefinitions().then(function (data) {
                    buildGraphicsAnimationInstanceDefinitions(data.animations);
                    buildGraphicsFontInstanceDefinitions(data.fonts);
                    setShaderProgram("Texture", 0);
                    setShaderProgram("Outline", 1);
                    for (var i = 2; i < renderPasses.length; ++i) {
                        setShaderProgram("Texture", i);
                    }
                    resolve();
                }, function (reason) {
                    var reasonPlus = "Failed to load graphics definitions";
                    if (reason !== null) {
                        reasonPlus = reasonPlus + "\r\n" + reason;
                    }
                    reject(reasonPlus);
                });
            });
            var textureInformationPromise = new Promise(function (resolve, reject) {
                dataEngine.loadAllTextureInformation().then(function (data) {
                    buildTextureInformation(data);
                    resolve();
                }, function (reason) {
                    var reasonPlus = "Failed to load texture information";
                    if (reason !== null) {
                        reasonPlus = reasonPlus + "\r\n" + reason;
                    }
                    reject(reasonPlus);
                });
            });
            return Promise.all([webGLPromise, graphicsInstanceDefinitionsPromise, textureInformationPromise]);
        };

        var getAnimationStateDefinition = function (gfxCompDefId, animationState) {
            return gfx2DAnimationDefinitions[gfxCompDefId].animationStateDefinitions[animationState];
        };

        var getAnimationStateDefinitionOfGraphicsComponentInstance = function (gfxComp) {
            return getAnimationStateDefinition(gfxComp.id, gfxComp.animationState);
        };

        var getAnimationFrameDefinition = function (gfxCompDefId, animationState, animationFrame) {
            return gfx2DAnimationDefinitions[gfxCompDefId].animationStateDefinitions[animationState].animationFrameDefinitions[animationFrame];
        };

        var getAnimationFrameDefinitionOfGraphicsComponentInstance = function (gfxComp) {
            return getAnimationFrameDefinition(gfxComp.id, gfxComp.animationState, gfxComp.animationFrame);
        };

        var draw = function (vertexVerts, textureVerts, webGLShaderProgram, webGLVertexShaderExtraStep, webGLFragmentShaderExtraStep, texture) {
            webGL.useProgram(webGLShaderProgram);

            ////////
            // VERTEX

            // vertex buffer
            webGL.bindBuffer(webGL.ARRAY_BUFFER, webGLSquareVerticesBuffer);
            webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(vertexVerts), webGL.STATIC_DRAW);

            // vertex shader
            var positionLocation = webGL.getAttribLocation(webGLShaderProgram, "a_position")
            if (positionLocation > -1) {
                webGL.enableVertexAttribArray(positionLocation);
                webGL.vertexAttribPointer(positionLocation, 2, webGL.FLOAT, false, 0, 0);
            }

            var resolutionLocation = webGL.getUniformLocation(webGLShaderProgram, "u_resolution");
            if (resolutionLocation !== null) {
                webGL.uniform2f(resolutionLocation, width, height);
            }

            if (webGLVertexShaderExtraStep != null) { // intentional truthiness
                webGLVertexShaderExtraStep(webGL, webGLShaderProgram, textureInformation[texture]);
            }

            ////////
            // FRAGMENT

            // fragment buffer
            webGL.bindBuffer(webGL.ARRAY_BUFFER, webGLTexCoordBuffer);
            webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(textureVerts), webGL.STATIC_DRAW);

            // fragment shader
            var texCoordLocation = webGL.getAttribLocation(webGLShaderProgram, "a_texCoord");
            if (texCoordLocation > -1) {
                webGL.enableVertexAttribArray(texCoordLocation);
                webGL.vertexAttribPointer(texCoordLocation, 2, webGL.FLOAT, false, 0, 0);
            }

            if (webGLFragmentShaderExtraStep != null) { // intentional truthiness
                webGLFragmentShaderExtraStep(webGL, webGLShaderProgram, textureInformation[texture]);
            }

            // bind active texture
            if (texture !== activeTexture) {
                webGL.activeTexture(webGL.TEXTURE0);
                webGL.bindTexture(webGL.TEXTURE_2D, textureInformation[texture].webGLTexture);

                activeTexture = texture;
            }

            // draw
            webGL.drawArrays(webGL.TRIANGLES, 0, vertexVerts.length / 2);
        };

        var draw2DAnimations = function (gfx2DAnimationInstances, renderPass, delta) {
            if (gfx2DAnimationInstances.length === 0 && gfx2DAnimationInstances.duplicates.length === 0) {
                return;
            }

            var webGLShaderProgram = webGLShaderPrograms[renderPass];
            var webGLVertexShaderExtraStep = webGLVertexShaderExtraSteps[renderPass];
            var webGLFragmentShaderExtraStep = webGLFragmentShaderExtraSteps[renderPass];

            var vertexVerts = [];
            var textureVerts = [];

            var gfxCompFunc = function (gfxComp, i) {
                // vertex locations
                gfxComp.vertices.forEach(function (vvv) {
                    vertexVerts.push(vvv.x, vvv.y);
                });

                // texture coords
                textureVerts.addRange(gfxComp.textureCoords);

                // same texture? don't draw yet
                var nextGfxComp = (gfx2DAnimationInstances.length > 0 && i !== gfx2DAnimationInstances.length - 1) ? gfx2DAnimationInstances[i + 1].graphics : null;
                var nextAnimationFrame = (nextGfxComp !== null) ? getAnimationFrameDefinitionOfGraphicsComponentInstance(nextGfxComp) : null;
                if (nextAnimationFrame === null || animationFrameDefinition.texture !== nextAnimationFrame.texture) {
                    draw(vertexVerts, textureVerts, webGLShaderProgram, webGLVertexShaderExtraStep, webGLFragmentShaderExtraStep, animationFrameDefinition.texture);

                    vertexVerts = [];
                    textureVerts = [];
                }
            };

            // draw 2d animation
            for (var i = 0; i < gfx2DAnimationInstances.length; ++i) {
                var g = gfx2DAnimationInstances[i];
                var gfxComp = g.graphics;
                var animationFrameDefinition = getAnimationFrameDefinitionOfGraphicsComponentInstance(gfxComp);

                gfxComp.update();

                // animate
                gfxComp.currentDuration += delta;
                if (animationFrameDefinition.duration !== null && gfxComp.currentDuration > animationFrameDefinition.duration) {
                    var animationStateDefinition = getAnimationStateDefinitionOfGraphicsComponentInstance(gfxComp);
                    gfxComp.animationFrame = (gfxComp.animationFrame + 1) % animationStateDefinition.animationFrameDefinitions.length;
                    animationFrameDefinition = animationStateDefinition.animationFrameDefinitions[gfxComp.animationFrame];
                    gfxComp.setTextureCoords(animationFrameDefinition.texCoordTop, animationFrameDefinition.texCoordRight, animationFrameDefinition.texCoordBottom, animationFrameDefinition.texCoordLeft);
                    gfxComp.currentDuration = 0;
                }

                gfxCompFunc(gfxComp, i);
            }
            for (var i = 0; i < gfx2DAnimationInstances.duplicates.length; ++i) {
                var gId = gfx2DAnimationInstances.duplicates[i];
                var gfxComp = getGraphicsComponentInstance2DAnimationById(gId).graphics;
                var animationFrameDefinition = getAnimationFrameDefinitionOfGraphicsComponentInstance(gfxComp);
                // we need the animationFrameDefinition for duplicates, but we should definitely not be animating anybody
                gfxCompFunc(gfxComp, i, animationFrameDefinition);
            }
        };

        var drawFonts = function (gfxFontInstances, renderPass, delta) {
            if (gfxFontInstances.length === 0 && gfxFontInstances.duplicates.length === 0) {
                return;
            }

            var webGLShaderProgram = webGLShaderPrograms[renderPass];
            var webGLVertexShaderExtraStep = webGLVertexShaderExtraSteps[renderPass];
            var webGLFragmentShaderExtraStep = webGLFragmentShaderExtraSteps[renderPass];

            var vertexVerts = [];
            var textureVerts = [];

            var gfxCompFunc = function (gfxComp, i) {
                // vertex locations
                gfxComp.vertices.forEach(function (vv) {
                    vv.forEach(function (vvv) {
                        vertexVerts.push(vvv.x, vvv.y);
                    });
                });

                // texture coords
                gfxComp.textureCoords.forEach(function (vv) {
                    vv.forEach(function (vvv) {
                        textureVerts.push(vvv.x, vvv.y);
                    });
                });

                var currTexture = gfxFontDefinitions[gfxComp.id].fontTextureDefinition.texture;

                // same texture? don't draw yet
                var nextGfxComp = (gfxFontInstances.length > 0 && i !== gfxFontInstances.length - 1) ? gfxFontInstances[i + 1].graphics : null;
                if (nextGfxComp == null || gfxFontDefinitions[nextGfxComp.id].fontTextureDefinition.texture !== currTexture) {
                    draw(vertexVerts, textureVerts, webGLShaderProgram, webGLVertexShaderExtraStep, webGLFragmentShaderExtraStep, currTexture);

                    vertexVerts = [];
                    textureVerts = [];
                }
            };

            // draw fonts
            for (var i = 0; i < gfxFontInstances.length; ++i) {
                var g = gfxFontInstances[i];
                var gfxComp = g.graphics;

                gfxComp.update();

                gfxCompFunc(gfxComp, i);
            }
            for (var i = 0; i < gfxFontInstances.duplicates.length; ++i) {
                var gId = gfxFontInstances.duplicates[i];
                var gfxComp = getGraphicsComponentInstanceFontById(gId).graphics;
                gfxCompFunc(gfxComp, i);
            }
        };

        this.update = function (delta) {
            webGL.clear(webGL.COLOR_BUFFER_BIT | webGL.DEPTH_BUFFER_BIT);
            
            var activeGameStates = gameStateEngine.getActiveGfxGameStates();
            activeGameStates.forEach(function (gameState) {
                var gfxGameState = gfxGameStates[gameState];
                gfxGameState.zOrders.forEach(function (zOrder) {
                    gfxGameState.renderPasses.forEach(function (renderPass) {
                        draw2DAnimations(gfxGameState.gfx2DAnimationInstances[zOrder][renderPass], renderPass, delta);
                        drawFonts(gfxGameState.gfxFontInstances[zOrder][renderPass], renderPass, delta);
                    });
                });
            });
        };

        this.shutdown = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                textureInformation.forOwnProperties(function (key, value) {
                    webGL.deleteTexture(value.webGLTexture);
                });
                textureInformation = {};
                gfx2DAnimationDefinitions = [];
                var gfxFontDefinitions = [];
                gfxGameStates.forOwnProperties(function (key, value) {
                    value.zOrders.forEach(function (zOrder) {
                        value.renderPasses.forEach(function (renderPass) {
                            for (var i = 0; i < value.gfx2DAnimationInstances[zOrder][renderPass].length; ++i) {
                                value.gfx2DAnimationInstances[zOrder][renderPass][i].destroy(messengerEngine);
                            }
                            for (var i = 0; i < value.gfxFontInstances[zOrder][renderPass].length; ++i) {
                                value.gfxFontInstances[zOrder][renderPass][i].destroy(messengerEngine);
                            }
                        });
                    });
                });
                while (renderPasses.length > 0) {
                    var renderPass = renderPasses[0];
                    
                    renderPasses.shift();
                }
                renderPasses = [];
                zOrders = [];
                gfxGameStates = {};
                gfxCompTypeDefinitions = {};

                webGL = null;
                webGLShaderPrograms = [];
                webGLVertexShaderExtraSteps = [];
                webGLFragmentShaderExtraSteps = [];
                webGLSquareVerticesBuffer = null;
                webGLTexCoordBuffer = null;
                messengerEngine.unregisterObject(that);
                resolve();
            });
        };

        var addGameState = function (name) {
            if (!gfxGameStates[name]) { // intentional truthiness
                gfxGameStates[name] = new namespace.Engines.GfxEngine.GameState(name, zOrders, renderPasses);
            }
        };

        var removeGameState = function (name) {
            if (gfxGameStates[name]) { // intentional truthiness
                var gfxGameState = gfxGameStates[name];
                var gfxCompInstance;
                gfxGameState.zOrders.forEach(function (zOrder) {
                    gfxGameState.renderPasses.forEach(function (renderPass) {
                        while (gfxGameState.gfx2DAnimationInstances[zOrder][renderPass].length > 0) {
                            gfxCompInstance = gfxGameStates[name].gfx2DAnimationInstances[zOrder][renderPass].pop();
                            gfxCompInstance.destroy(messengerEngine);
                        }
                        while (gfxGameState.gfxFontInstances[zOrder][renderPass].length > 0) {
                            gfxCompInstance = gfxGameStates[name].gfxFontInstances[zOrder][renderPass].pop();
                            gfxCompInstance.destroy(messengerEngine);
                        }
                    });
                });
                
                gfxGameStates[name] = null;
            }
        };

        var createGraphicsAnimationInstance = function (entity, gfxCompDefId, gameState) {
            var afd = getAnimationFrameDefinition(gfxCompDefId, 0, 0);
            var instance = new Inst.Gfx2DAnim(entity, gfxCompDefId, afd.width, afd.height);
            instance.graphics.setTextureCoords(afd.texCoordTop, afd.texCoordRight, afd.texCoordBottom, afd.texCoordLeft);

            var zOrder = gfx2DAnimationDefinitions[gfxCompDefId].zOrder;
            var renderPass = gfx2DAnimationDefinitions[gfxCompDefId].renderPass;
            addGameState(gameState);
            gfxGameStates[gameState].gfx2DAnimationInstances[zOrder][renderPass].push(instance);
        };

        var createGraphicsFontInstance = function (entity, gfxCompDefId, fontText, gameState) {
            var fontDefinition = gfxFontDefinitions[gfxCompDefId];
            var instance = new Inst.GfxFont(entity, gfxCompDefId, fontDefinition.fontTextureDefinition, (fontText) /* intentional truthiness */ ? fontText : "");

            var zOrder = fontDefinition.zOrder;
            var renderPass = fontDefinition.renderPass;
            addGameState(gameState);
            gfxGameStates[gameState].gfxFontInstances[zOrder][renderPass].push(instance);
        };

        this.createGraphicsComponentInstance = function (entity, gfxCompDefId, gameState) {
            switch (gfxCompTypeDefinitions[gfxCompDefId]) {
                case gfxCompType2DAnimation:
                    createGraphicsAnimationInstance(entity, gfxCompDefId, gameState);
                    break;1

                case gfxCompTypeFont:
                    createGraphicsFontInstance(entity, gfxCompDefId, "", gameState);
                    break;
            }
        };

        this.createGraphicsComponentInstanceForFont = function (entity, gfxCompDefId, fontText, gameState) {
            createGraphicsFontInstance(entity, gfxCompDefId, fontText, gameState);
        };

        var setShaderProgram = function (programName, renderPass) {
            var shaderDefinition = shaderList.firstOrNull(function (x) {
                return x.name === programName;
            });
            if (shaderDefinition !== undefined && shaderDefinition !== null) {
                webGLShaderPrograms[renderPass] = shaderDefinition.program;
                webGLVertexShaderExtraSteps[renderPass] = shaderDefinition.vertexShaderExtraSteps;
                webGLFragmentShaderExtraSteps[renderPass] = shaderDefinition.fragmentShaderExtraSteps;
            }
        };

        var getGraphicsComponentInstance = function (instanceId, array, zOrders, renderPasses) {
            var instance = null;

            for (var z = 0, zEnd = zOrders.length; z < zEnd; ++z) {
                var zOrder = zOrders[z];
                for (var rp = 0, rpEnd = renderPasses.length; rp < rpEnd; ++rp) {
                    var renderPass = renderPasses[rp];
                    if (array[zOrder][renderPass].length === 0) {
                        continue;
                    }
                    instance = array[zOrder][renderPass].firstOrNull(function (x) {
                        return x.instanceId === instanceId;
                    });
                    if (instance !== null) {
                        break;
                    }
                }
            }
            return instance;
        };

        var getGraphicsComponentInstance2DAnimationByIdAndGameState = function (instanceId, gameState) {
            var inst = getGraphicsComponentInstance(instanceId, gfxGameState.gfx2DAnimationInstances, gfxGameState.zOrders, gfxGameState.renderPasses);
            return inst;
        };

        var getGraphicsComponentInstance2DAnimationById = function (instanceId) {
            var inst = gfxGameStates.forOwnProperties(function (key, value) {
                var instance = getGraphicsComponentInstance(instanceId, value.gfx2DAnimationInstances, value.zOrders, value.renderPasses);
                if (instance !== null) {
                    return instance;
                }
            });
            return (inst !== undefined) ? inst : null;
        };

        var getGraphicsComponentInstanceFontByIdAndGameState = function (instanceId, gameState) {
            var gfxGameState = gfxGameStates[gameState];
            var inst = getGraphicsComponentInstance(instanceId, gfxGameState.gfxFontInstances, gfxGameState.zOrders, gfxGameState.renderPasses);
            return inst;
        };

        var getGraphicsComponentInstanceFontById = function (instanceId) {
            var inst = gfxGameStates.forOwnProperties(function (key, value) {
                var instance = getGraphicsComponentInstance(instanceId, value.gfxFontInstances, value.zOrders, value.renderPasses);
                if (instance !== null) {
                    return instance;
                }
            });
            return (inst !== undefined) ? inst : null;
        };

        var setInstanceAnimationState = function (instanceId, animationState) {
            var gfxInstance = getGraphicsComponentInstance2DAnimationById(instanceId);
            if (gfxInstance !== null) {
                gfxInstance.graphics.animationState = animationState;
                setAnimationFrameFromDefinition(gfxInstance.graphics);
            }
        };

        var setInstanceAnimationFrame = function (instanceId, animationFrame) {
            var gfxInstance = getGraphicsComponentInstance2DAnimationById(instanceId);
            if (gfxInstance !== null) {
                gfxInstance.graphics.animationFrame = animationFrame;
                setAnimationFrameFromDefinition(gfxInstance.graphics);
            }
        };

        var setAnimationFrameFromDefinition = function (gfxComp) {
            var animationFrameDefinition = getAnimationFrameDefinitionOfGraphicsComponentInstance(gfxComp);
            gfxComp.setTextureCoords(animationFrameDefinition.texCoordTop, animationFrameDefinition.texCoordRight, animationFrameDefinition.texCoordBottom, animationFrameDefinition.texCoordLeft);
            gfxComp.currentDuration = 0;
        };

        var setInstanceRenderPass = function (instanceId, animationFrame) {
            throw "Not yet implemented.";
        };

        var addDuplicateInstanceZOrderRenderPass = function (instanceId, gameState, zOrder, renderPass) {
            var instanceToDuplicate = getGraphicsComponentInstance2DAnimationById(instanceId);
            if (instanceToDuplicate !== null) {
                gfxGameStates[gameState].gfx2DAnimationInstances[zOrder][renderPass].duplicates.push(instanceId);
            } else {
                instanceToDuplicate = getGraphicsComponentInstanceFontById(instanceId);
                if (instanceToDuplicate !== null) {
                    gfxGameStates[gameState].gfxFontInstances[zOrder][renderPass].duplicates.push(instanceId);
                }
            }
        };

        var removeDuplicateInstanceZOrderRenderPass = function (instanceId) {
            gfxGameStates.forOwnProperties(function (key, value) {
                value.zOrders.forEach(function (zOrder) {
                    value.renderPasses.forEach(function (renderPass) {
                        for (var i = 0, j = value.gfx2DAnimationInstances[zOrder][renderPass].duplicates.length; i < j; ++i) {
                            if (value.gfx2DAnimationInstances[zOrder][renderPass].duplicates[i] === instanceId) {
                                value.gfx2DAnimationInstances[zOrder][renderPass].duplicates.splice(i, 1);
                                return;
                            }
                        }
                        for (var i = 0, j = value.gfxFontInstances[zOrder][renderPass].duplicates.length; i < j; ++i) {
                            if (value.gfxFontInstances[zOrder][renderPass].duplicates[i] === instanceId) {
                                value.gfxFontInstances[zOrder][renderPass].duplicates.splice(i, 1);
                                return;
                            }
                        }
                    });
                });
            });
        };

        var setInstanceText = function (instanceId, text) {
            var instance = getGraphicsComponentInstanceFontById(instanceId);
            if (instance !== null) {
                instance.graphics.updateText(text ? text : "");
            }
        };

        var getGraphicsComponentInstanceForEntityInstance = function (callback, instanceId) {
            var instance = getGraphicsComponentInstance2DAnimationById(instanceId);
            if (instance === null) {
                instance = getGraphicsComponentInstanceFontById(instanceId);
            }
            if (instance !== null) {
                callback(instance);
            }
        };

        this.swapInstanceGameState = function (instanceId, oldGameState, newGameState) {
            var oldGfxGameState = gfxGameStates[oldGameState];
            var newGfxGameState = gfxGameStates[newGameState];
            for (var z = 0, zEnd = oldGfxGameState.zOrders.length; z < zEnd; ++z) {
                for (var rp = 0, rpEnd = oldGfxGameState.renderPasses.length; rp < rpEnd; ++rp) {
                    if (oldGfxGameState.gfx2DAnimationInstances[z][rp].length > 0) {
                        for (var k = 0; k < oldGfxGameState.gfx2DAnimationInstances[z][rp].length; ++k) {
                            if (oldGfxGameState.gfx2DAnimationInstances[z][rp][k].instanceId === instanceId) {
                                var instance = oldGfxGameState.gfx2DAnimationInstances[z][rp][k];
                                oldGfxGameState.gfx2DAnimationInstances[z][rp].splice(k, 1);
                                newGfxGameState.gfx2DAnimationInstances[z][rp].push(instance);

                                // if we're swapping a game state, just remove all duplicates altogether
                                removeDuplicateInstanceZOrderRenderPass(instanceId);
                                return;
                            }
                        }
                    }

                    if (oldGfxGameState.gfxFontInstances[z][rp].length > 0) {
                        for (var k = 0; k < oldGfxGameState.gfxFontInstances[z][rp].length; ++k) {
                            if (oldGfxGameState.gfxFontInstances[z][rp][k].instanceId === instanceId) {
                                var instance = oldGfxGameState.gfxFontInstances[z][rp][k];
                                oldGfxGameState.gfxFontInstances[z][rp].splice(k, 1);
                                newGfxGameState.gfxFontInstances[z][rp].push(instance);

                                // if we're swapping a game state, just remove all duplicates altogether
                                removeDuplicateInstanceZOrderRenderPass(instanceId);
                                return true;
                            }
                        }
                    }
                }
            }
        };

        this.removeGraphicsComponentInstanceFromMessage = function (instanceId) {
            gfxGameStates.forOwnProperties(function (key, value) {
                for (var z = 0, zEnd = value.zOrders.length; z < zEnd; ++z) {
                    for (var rp = 0, rpEnd = value.renderPasses.length; rp < rpEnd; ++rp) {
                        if (value.gfx2DAnimationInstances[z][rp].length > 0) {
                            for (var k = 0; k < value.gfx2DAnimationInstances[z][rp].length; ++k) {
                                if (value.gfx2DAnimationInstances[z][rp][k].instanceId === instanceId) {
                                    value.gfx2DAnimationInstances[z][rp][k].destroy(messengerEngine);
                                    value.gfx2DAnimationInstances[z][rp].splice(k, 1);
                                    removeDuplicateInstanceZOrderRenderPass(instanceId);
                                    return true;
                                }
                            }
                        }

                        if (value.gfxFontInstances[z][rp].length > 0) {
                            for (var k = 0; k < value.gfxFontInstances[z][rp].length; ++k) {
                                if (value.gfxFontInstances[z][rp][k].instanceId === instanceId) {
                                    value.gfxFontInstances[z][rp][k].destroy(messengerEngine);
                                    value.gfxFontInstances[z][rp].splice(k, 1);
                                    removeDuplicateInstanceZOrderRenderPass(instanceId);
                                    return true;
                                }
                            }
                        }
                    }
                }
            });
        };

        messengerEngine.registerForMessage("setShaderProgram", this, setShaderProgram);
        messengerEngine.registerForMessage("setInstanceAnimationState", this, setInstanceAnimationState);
        messengerEngine.registerForMessage("setInstanceAnimationFrame", this, setInstanceAnimationFrame);
        messengerEngine.registerForMessage("setInstanceRenderPass", this, setInstanceRenderPass);
        messengerEngine.registerForMessage("addDuplicateInstanceZOrderRenderPass", this, addDuplicateInstanceZOrderRenderPass);
        messengerEngine.registerForMessage("removeDuplicateInstanceZOrderRenderPass", this, removeDuplicateInstanceZOrderRenderPass);
        messengerEngine.registerForMessage("setInstanceText", this, setInstanceText);
        messengerEngine.registerForMessage("clearInstanceText", this, setInstanceText);
        messengerEngine.registerForRequest("getGraphicsComponentInstanceForEntityInstance", this, getGraphicsComponentInstanceForEntityInstance);
    };

    namespace.Engines.GfxEngine.getShader = function (gl, id) {
        var shaderScript;
        var theSource;
        var currentChild;
        var shader;

        shaderScript = document.getElementById(id);

        if (!shaderScript) {
            return null;
        }

        theSource = "";
        currentChild = shaderScript.firstChild;

        while (currentChild) {
            if (currentChild.nodeType === currentChild.TEXT_NODE) {
                theSource += currentChild.textContent;
            }

            currentChild = currentChild.nextSibling;
        }

        if (shaderScript.type === "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type === "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            // Unknown shader type
            return null;
        }

        gl.shaderSource(shader, theSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return null;
        }
        namespace.Engines.GfxEngine.shaderElements.push(shaderScript);

        return shader;
    };

    namespace.Engines.GfxEngine.compileShader = function (gl, fragmentShaderId, vertexShaderId) {
        var fragmentShader = namespace.Engines.GfxEngine.getShader(gl, fragmentShaderId);
        var vertexShader = namespace.Engines.GfxEngine.getShader(gl, vertexShaderId);

        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            return null;
        }

        return shaderProgram;
    };


    namespace.Engines.GfxEngine.loadShaderScripts = function (data, headElem) {
        namespace.Engines.GfxEngine.shaderList = [];
        namespace.Engines.GfxEngine.shaderElements = [];

        var gfxShaderElements = namespace.Engines.GfxEngine.shaderElements;
        data.forEach(function (s) {
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", s.shaderFile);
            headElem.appendChild(script);
            gfxShaderElements.push(script);
        });
        var gfxShaderList = namespace.Engines.GfxEngine.shaderList;
        return new Promise(function (resolve, reject) {
            var iterations = 0;
            var iterationsMax = 60000; // try for a whole minute!
            var checkShadersLoaded = function () {
                if (iterations < iterationsMax) {
                    if (gfxShaderList.length === data.length) {
                        resolve();
                    } else {
                        ++iterations;
                        // shader constructors might send messages
                        namespace.Globals.globalMessengerEngine.update();
                        setTimeout(checkShadersLoaded, 1);
                    }
                } else {
                    reject("Timeout on loading shaders");
                }
            };
            setTimeout(checkShadersLoaded, 1);
        });
    };

    namespace.Engines.GfxEngine.unloadShaderScripts = function () {
        return new Promise(function (resolve, reject) {
            namespace.Engines.GfxEngine.shaderElements.forEach(function (e) {
                e.parentElement.removeChild(e);
            });
            namespace.Engines.GfxEngine.shaderElements = [];
            namespace.Engines.GfxEngine.shaderList = [];
            resolve();
        });
    };

    ////////
    // GfxEngine GameState
    namespace.Engines.GfxEngine.GameState = function (name, zOrders, renderPasses) {
        this.name = name;
        this.gfx2DAnimationInstances = [];
        this.gfxFontInstances = [];
        this.zOrders = [];
        this.renderPasses = [];

        var that = this;
        zOrders.forEach(function (zOrder) {
            that.addZOrder(zOrder);
        });
        renderPasses.forEach(function (renderPass) {
            that.addRenderPass(renderPass);
        });
    };

    namespace.Engines.GfxEngine.GameState.prototype.addZOrder = function (zOrder) {
        if(!this.zOrders.contains(zOrder)) {
            this.zOrders.push(zOrder);
        }
        if (this.gfx2DAnimationInstances[zOrder] == null) { // intentional truthiness
            this.gfx2DAnimationInstances[zOrder] = [];
        }
        if (this.gfxFontInstances[zOrder] == null) { // intentional truthiness
            this.gfxFontInstances[zOrder] = [];
        }
        // this will add all render passes to the new zOrder
        var that = this;
        this.renderPasses.forEach(function (renderPass) {
            that.addRenderPass(renderPass);
        });
    };

    namespace.Engines.GfxEngine.GameState.prototype.addRenderPass = function (renderPass) {
        if (!this.renderPasses.contains(renderPass)) {
            this.renderPasses.push(renderPass);
        }

        var that = this;
        this.zOrders.forEach(function (zOrder) {
            if (that.gfx2DAnimationInstances[zOrder][renderPass] == null) { // intentional truthiness
                that.gfx2DAnimationInstances[zOrder][renderPass] = [];
                that.gfx2DAnimationInstances[zOrder][renderPass].duplicates = [];
            }
            if (that.gfxFontInstances[zOrder][renderPass] == null) { // intentional truthiness
                that.gfxFontInstances[zOrder][renderPass] = [];
                that.gfxFontInstances[zOrder][renderPass].duplicates = [];
            }
        });
    };

}(window.TTTD = window.TTTD || {}));