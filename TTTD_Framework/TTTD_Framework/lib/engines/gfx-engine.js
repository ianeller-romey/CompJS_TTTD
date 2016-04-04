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
        this.entityTypeName = entity.typeName;
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
        this.vertices = [];
        this.textureCoords = [];

        var that = this;
        var init = function () {
            var verts = VERTICES;
            var scaledVertices = [];
            var translatedVertices = [];

            verts.forEach(function (vert, i) {
                scaledVertices.push(new namespace.Math.Vector2D(vert.x * that.width * transformation.scale.x, vert.y * that.height * transformation.scale.y));
                translatedVertices.push(new namespace.Math.Vector2D(scaledVertices[i].x + transformation.position.x, scaledVertices[i].y + transformation.position.y));
            });

            that.vertices = translatedVertices;

            var updateScaledVertices = function (w, h, scale) {
                for (var i = 0; i < verts.length; ++i) {
                    scaledVertices[i].x = verts[i].x * w * scale.x;
                    scaledVertices[i].y = verts[i].y * h * scale.y;
                }
            };

            var updateTranslatedVertices = function (position) {
                for (var i = 0; i < verts.length; ++i) {
                    translatedVertices[i].x = scaledVertices[i].x + position.x;
                    translatedVertices[i].y = scaledVertices[i].y + position.y;
                }
            };

            that.width.notifyMe(function (newWidth) {
                updateScaledVertices(newWidth, that.height, transformation.scale);
            });

            that.height.notifyMe(function (newHeight) {
                updateScaledVertices(that.width, newHeight, transformation.scale);
            });

            transformation.scale.notifyMe(function (newScale) {
                updateScaledVertices(that.width, that.height, newScale);
            });

            transformation.position.notifyMe(function (newPosition) {
                updateTranslatedVertices(newPosition);
            });
        };
        init();
    };

    namespace.Comp.Inst.Gfx2DAnim.Graphics.prototype.setWidth = function (newWidth) {
        this.width = this.width.setAndNotify(newWidth);
    };

    namespace.Comp.Inst.Gfx2DAnim.Graphics.prototype.setHeight = function (newHeight) {
        this.height = this.height.setAndNotify(newHeight);
    };

    namespace.Comp.Inst.Gfx2DAnim.Graphics.prototype.setTextureCoords = function () {
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
        this.entityTypeName = entity.typeName;
        this.transformation = entity.transformation;
        this.graphics = new namespace.Comp.Inst.GfxFont.Graphics(gfxCompDefId, fontTextureDefinition.startT, fontTextureDefinition.startL, fontTextureDefinition.characterWidth, fontTextureDefinition.characterHeight, fontTextureDefinition.textureWidth, text, this.transformation);
    };

    namespace.Comp.Inst.GfxFont.prototype = new namespace.Comp.Inst.Component();

    namespace.Comp.Inst.GfxFont.Graphics = function (gfxCompDefId, startT, startL, characterWidth, characterHeight, textureWidth, text, transformation) {
        this.id = gfxCompDefId;
        this.textureWidth = textureWidth;
        this.startT = startT;
        this.startL = startL;
        this.characterWidth = characterWidth;
        this.characterHeight = characterHeight;
        this.vertices = [];
        this.textureCoords = [];
        this.text = new String();

        var that = this;
        var init = function () {
            var verts = VERTICES;
            var fonts = FONT_DICTIONARY;
            var transformationScale = transformation.scale.toXYObject();
            var transformationPosition = transformation.position.toXYObject();
            var scaledVertices = [];
            var translatedVertices = [];

            verts.forEach(function (vert, i) {
                scaledVertices.push(new namespace.Math.Vector2D(vert.x * that.characterWidth * transformationScale.x, vert.y * that.characterHeight * transformationScale.y));
            });

            that.vertices = translatedVertices;

            var updateScaledVertices = function (scale) {
                transformationScale.x = scale.x;
                transformationScale.y = scale.y
                for (var i = 0; i < verts.length; ++i) {
                    scaledVertices[i].x = verts[i].x * that.characterWidth * transformationScale.x;
                    scaledVertices[i].y = verts[i].y * that.characterHeight * transformationScale.y;
                }
            };

            var updateTranslatedVertices = function (text, position) {
                transformationPosition.x = position.x;
                transformationPosition.y = position.y

                var yOff = 0;
                var xOff = 0;
                for (var i = 0; i < translatedVertices.length; ++i, ++xOff) {
                    if (text[i] === "\n") {
                        yOff += that.characterHeight;
                        xOff = -1;
                    }
                    for (var j = 0; j < verts.length; ++j) {
                        translatedVertices[i][j].x = scaledVertices[j].x + (transformationPosition.x) + (xOff * that.characterWidth * transformationScale.x);
                        translatedVertices[i][j].y = scaledVertices[j].y + (transformationPosition.y) + (yOff * transformationScale.y);
                    }
                }
            };

            var calculateTextureCoordinates = function (pixel) {
                return (2 * pixel + 1) / (2 * that.textureWidth);
            };

            var updateTextureCoords = function (text) {
                for (var i = 0; i < that.textureCoords.length; ++i) {
                    var letter = text[i];
                    if (letter === "\n") {
                        letter = " ";
                    }
                    var xOff = that.startL + (fonts[letter].column * that.characterWidth);
                    var yOff = that.startT + (fonts[letter].row * that.characterHeight);

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

            var updateText = function (text) {
                while (translatedVertices.length < text.length) {
                    var i = translatedVertices.push(new Array(6));
                    --i;
                    var j = that.textureCoords.push(new Array(6));
                    --j;
                    verts.forEach(function (vert, k) {
                        translatedVertices[i][k] = new namespace.Math.Vector2D(vert.x, vert.y);
                        that.textureCoords[j][k] = new namespace.Math.Vector2D(vert.x, vert.y);
                    });
                }
                while (translatedVertices.length > text.length) {
                    translatedVertices.pop();
                    that.textureCoords.pop();
                }
                updateTranslatedVertices(text, transformation.position);
                updateTextureCoords(text);
            };

            transformation.scale.notifyMe(function (newScale) {
                updateScaledVertices(newScale);
                updateTranslatedVertices(that.text, transformationPosition);
            });

            transformation.position.notifyMe(function (newPosition) {
                updateTranslatedVertices(that.text, newPosition);
            });

            that.text.notifyMe(function (newText) {
                updateText(newText);
            });
        };
        init();

        this.text = this.text.setAndNotify(text);
    };

    namespace.Comp.Inst.GfxFont.Graphics.prototype.setText = function (text) {
        this.text = this.text.setAndNotify(text);
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
        this.startT = def.startT;
        this.startL = def.startL;
        this.characterWidth = def.characterWidth;
        this.characterHeight = def.characterHeight;
    };

    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.GraphicsFont = function (def) {
        var Def = namespace.Comp.Def;

        this.zOrder = def.zOrder;
        this.renderPass = def.renderPass;
        this.fontTextureDefinition = new Def.GraphicsFontTexture(def.fontTextureDefinition);
    };

    ////////
    // GfxEngine
    namespace.Engines = namespace.Engines || {};
    namespace.Engines.GfxEngine = function (canvasElem) {
        var Inst = namespace.Comp.Inst;
        var Def = namespace.Comp.Def;

        var messengerEngine = namespace.Globals.globalMessengerEngine;
        var dataEngine = namespace.Globals.globalDataEngine;

        var textureDefinitions = {};
        var gfx2DAnimationDefinitions = [];
        var gfx2DAnimationInstances = [];
        var gfxFontDefinitions = [];
        var gfxFontInstances = [];
        var zOrders = [];
        var renderPasses = [];
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
            if (gfx2DAnimationInstances[zOrder] == null) {
                gfx2DAnimationInstances[zOrder] = [];
            }
            if (gfxFontInstances[zOrder] == null) {
                gfxFontInstances[zOrder] = [];
            }
            // this will add all render passes to the new zOrder
            renderPasses.forEach(function (renderPass) {
                addRenderPass(renderPass);
            });
        };

        var addRenderPass = function (renderPass) {
            if (!renderPasses.contains(renderPass)) {
                renderPasses.push(renderPass);
            }
            zOrders.forEach(function (zOrder) {
                if (gfx2DAnimationInstances[zOrder][renderPass] == null) {
                    gfx2DAnimationInstances[zOrder][renderPass] = [];
                }
                if (gfxFontInstances[zOrder][renderPass] == null) {
                    gfxFontInstances[zOrder][renderPass] = [];
                }
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

        var buildTextureDefinitions = function (data) {
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
                var texture = data[i];
                if (textureDefinitions[texture] === undefined) {
                    var image = new Image();
                    var webGLTexture = webGL.createTexture();
                    textureDefinitions[texture] = {
                        image: image,
                        webGLTexture: webGLTexture
                    };

                    var promise = createWebGLTexture(image, webGLTexture);
                    loadImagePromises.push(promise);

                    image.src = texture;
                }
            }
            return Promise.all(loadImagePromises);
        };

        this.init = function () {
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
                    // Initialize animations first ...
                    var textures2DAnimation = data.animations.select(function (x) {
                        return x.animationStateDefinitions.select(function (y) {
                            return y.animationFrameDefinitions.select(function (z) {
                                return z.texture;
                            }).distinct();
                        }).aggregate(function (a, b) {
                            return a.addRange(b);
                        });
                    }).aggregate(function (a, b) {
                        return a.addRange(b);
                    }).distinct();
                    Promise.all([buildGraphicsAnimationInstanceDefinitions(data.animations), buildTextureDefinitions(textures2DAnimation)]).then(function () {
                        // ... then fonts
                        var texturesFonts = data.fonts.select(function (x) {
                            return x.fontTextureDefinition.texture;
                        }).distinct();
                        Promise.all([buildGraphicsFontInstanceDefinitions(data.fonts), buildTextureDefinitions(texturesFonts)]).then(function () {

                            for (var i = 0; i < renderPasses.length; ++i) {
                                setShaderProgram("Texture", i);
                            }
                            resolve();
                        }, function (reason) {
                            var reasonPlus = "Failed to build font definitions";
                            if (reason !== null) {
                                reasonPlus = reasonPlus + "\r\n" + reason;
                            }
                            reject(reasonPlus);
                        });
                    }, function (reason) {
                        var reasonPlus = "Failed to build 2D animation definitions";
                        if (reason !== null) {
                            reasonPlus = reasonPlus + "\r\n" + reason;
                        }
                        reject(reasonPlus);
                    });
                }, function (reason) {
                    var reasonPlus = "Failed to load graphics definitions";
                    if (reason !== null) {
                        reasonPlus = reasonPlus + "\r\n" + reason;
                    }
                    reject(reasonPlus);
                });
            });
            return Promise.all([webGLPromise, graphicsInstanceDefinitionsPromise]);
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
                webGLVertexShaderExtraStep(webGL, webGLShaderProgram);
            }

            // texture buffer
            webGL.bindBuffer(webGL.ARRAY_BUFFER, webGLTexCoordBuffer);
            webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(textureVerts), webGL.STATIC_DRAW);

            // texture shader
            var texCoordLocation = webGL.getAttribLocation(webGLShaderProgram, "a_texCoord");
            if (texCoordLocation > -1) {
                webGL.enableVertexAttribArray(texCoordLocation);
                webGL.vertexAttribPointer(texCoordLocation, 2, webGL.FLOAT, false, 0, 0);
            }

            if (webGLFragmentShaderExtraStep != null) { // intentional truthiness
                webGLFragmentShaderExtraStep(webGL, webGLShaderProgram);
            }

            // bind active texture
            if (texture !== activeTexture) {
                webGL.activeTexture(webGL.TEXTURE0);
                webGL.bindTexture(webGL.TEXTURE_2D, textureDefinitions[texture].webGLTexture);

                activeTexture = texture;
            }

            // draw
            webGL.drawArrays(webGL.TRIANGLES, 0, vertexVerts.length / 2);
        };

        var draw2DAnimations = function (zOrder, renderPass, delta) {
            if (gfx2DAnimationInstances.length === 0) {
                return;
            }

            var webGLShaderProgram = webGLShaderPrograms[renderPass];
            var webGLVertexShaderExtraStep = webGLVertexShaderExtraSteps[renderPass];
            var webGLFragmentShaderExtraStep = webGLFragmentShaderExtraSteps[renderPass];

            var vertexVerts = [];
            var textureVerts = [];

            // draw 2d animation
            for (var i = 0; i < gfx2DAnimationInstances[zOrder][renderPass].length; ++i) {
                var g = gfx2DAnimationInstances[zOrder][renderPass][i];
                var gfxComp = g.graphics;
                var animationFrameDefinition = getAnimationFrameDefinitionOfGraphicsComponentInstance(gfxComp);

                // animate
                gfxComp.currentDuration += delta;
                if (animationFrameDefinition.duration !== null && gfxComp.currentDuration > animationFrameDefinition.duration) {
                    var animationStateDefinition = getAnimationStateDefinitionOfGraphicsComponentInstance(gfxComp);
                    gfxComp.animationFrame = (gfxComp.animationFrame + 1) % animationStateDefinition.animationFrameDefinitions.length;
                    animationFrameDefinition = animationStateDefinition.animationFrameDefinitions[gfxComp.animationFrame];
                    gfxComp.setTextureCoords(animationFrameDefinition.texCoordTop, animationFrameDefinition.texCoordRight, animationFrameDefinition.texCoordBottom, animationFrameDefinition.texCoordLeft);
                    gfxComp.currentDuration = 0;
                }

                // vertex locations
                gfxComp.vertices.forEach(function (vvv) {
                    vertexVerts.push(vvv.x, vvv.y);
                });

                // texture coords
                textureVerts.addRange(gfxComp.textureCoords);

                // same texture? don't draw yet
                var nextGfxComp = (i !== gfx2DAnimationInstances[zOrder][renderPass].length - 1) ? gfx2DAnimationInstances[zOrder][renderPass][i + 1].graphics : null;
                var nextAnimationFrame = (nextGfxComp !== null) ? getAnimationFrameDefinitionOfGraphicsComponentInstance(nextGfxComp) : null;
                if (nextAnimationFrame === null || animationFrameDefinition.texture !== nextAnimationFrame.texture) {
                    draw(vertexVerts, textureVerts, webGLShaderProgram, webGLVertexShaderExtraStep, webGLFragmentShaderExtraStep, animationFrameDefinition.texture);

                    vertexVerts = [];
                    textureVerts = [];
                }
            }
        };

        var drawFonts = function (zOrder, renderPass, delta) {
            if (gfxFontInstances.length === 0) {
                return;
            }

            var webGLShaderProgram = webGLShaderPrograms[renderPass];
            var webGLVertexShaderExtraStep = webGLVertexShaderExtraSteps[renderPass];
            var webGLFragmentShaderExtraStep = webGLFragmentShaderExtraSteps[renderPass];

            var vertexVerts = [];
            var textureVerts = [];

            // draw 2d animation
            for (var i = 0; i < gfxFontInstances[zOrder][renderPass].length; ++i) {
                var g = gfxFontInstances[zOrder][renderPass][i];
                var gfxComp = g.graphics;

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
                var nextGfxComp = (i !== gfxFontInstances[zOrder][renderPass].length - 1) ? gfxFontInstances[zOrder][renderPass][i + 1].graphics : null;
                if (nextGfxComp == null || gfxFontDefinitions[nextGfxComp.id].fontTextureDefinition.texture !== currTexture) {
                    draw(vertexVerts, textureVerts, webGLShaderProgram, webGLVertexShaderExtraStep, webGLFragmentShaderExtraStep, currTexture);

                    vertexVerts = [];
                    textureVerts = [];
                }
            }
        };

        this.update = function (delta) {
            webGL.clear(webGL.COLOR_BUFFER_BIT | webGL.DEPTH_BUFFER_BIT);

            zOrders.forEach(function (zOrder) {
                renderPasses.forEach(function (renderPass) {
                    draw2DAnimations(zOrder, renderPass, delta);
                    drawFonts(zOrder, renderPass, delta);
                });
            });
        };

        this.shutdown = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                for (var texture in textureDefinitions) {
                    if (textureDefinitions.hasOwnProperty(texture)) {
                        webGL.deleteTexture(texture.webGLTexture);
                    }
                }
                textureDefinitions = {};
                gfx2DAnimationDefinitions = [];
                var gfxFontDefinitions = [];
                while (renderPasses.length > 0) {
                    var renderPass = renderPasses[0];
                    for (var i = 0; i < gfx2DAnimationInstances[renderPass].length; ++i) {
                        gfx2DAnimationInstances[renderPass][i].destroy(messengerEngine);
                    }
                    for (var i = 0; i < gfxFontInstances[renderPass].length; ++i) {
                        gfxFontInstances[renderPass][i].destroy(messengerEngine);
                    }
                    renderPasses.shift();
                }
                gfx2DAnimationInstances = [];
                gfxFontInstances = [];
                gfxCompTypeDefinitions = {};

                webGL = null;
                webGLShaderPrograms = [];
                webGLVertexShaderExtraSteps = [];
                webGLFragmentShaderExtraSteps = [];
                webGLSquareVerticesBuffer = null;
                webGLTexCoordBuffer = null;
                messengerEngine.unregisterAll(that);
                resolve();
            });
        };

        var createGraphicsAnimationInstance = function (entity, gfxCompDefId) {
            var afd = getAnimationFrameDefinition(gfxCompDefId, 0, 0);
            var instance = new Inst.Gfx2DAnim(entity, gfxCompDefId, afd.width, afd.height);
            instance.graphics.setTextureCoords(afd.texCoordTop, afd.texCoordRight, afd.texCoordBottom, afd.texCoordLeft);

            var zOrder = gfx2DAnimationDefinitions[gfxCompDefId].zOrder;
            var renderPass = gfx2DAnimationDefinitions[gfxCompDefId].renderPass;
            gfx2DAnimationInstances[zOrder][renderPass].push(instance);
        };

        var createGraphicsFontInstance = function (entity, gfxCompDefId) {
            var fontDefinition = gfxFontDefinitions[gfxCompDefId];
            var instance = new Inst.GfxFont(entity, gfxCompDefId, fontDefinition.fontTextureDefinition, "");

            var zOrder = gfx2DAnimationDefinitions[gfxCompDefId].zOrder;
            var renderPass = fontDefinition.renderPass;
            gfxFontInstances[zOrder][renderPass].push(instance);
        };

        this.createGraphicsComponentInstance = function (entity, gfxCompDefId) {
            switch (gfxCompTypeDefinitions[gfxCompDefId]) {
                case gfxCompType2DAnimation:
                    createGraphicsAnimationInstance(entity, gfxCompDefId);
                    break;

                case gfxCompTypeFont:
                    createGraphicsFontInstance(entity, gfxCompDefId);
                    break;
            }
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

        var getGraphicsComponentInstance = function (instanceId, array) {
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

        var getGraphicsComponentInstance2DAnimation = function (instanceId) {
            return getGraphicsComponentInstance(instanceId, gfx2DAnimationInstances);
        };

        var getGraphicsComponentInstanceFont = function (instanceId) {
            return getGraphicsComponentInstance(instanceId, gfxFontInstances);
        };

        var setInstanceAnimationState = function (instanceId, animationState) {
            var gfxInstance = getGraphicsComponentInstance2DAnimation(instanceId);
            if (gfxInstance !== null) {
                gfxInstance.graphics.animationState = animationState;
                setAnimationFrameFromDefinition(gfxInstance.graphics);
            }
        };

        var setInstanceAnimationFrame = function (instanceId, animationFrame) {
            var gfxInstance = getGraphicsComponentInstance2DAnimation(instanceId);
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

        var setInstanceText = function (instanceId, text) {
            var gfxInstance = getGraphicsComponentInstanceFont(instanceId);
            if (gfxInstance !== null) {
                gfxInstance.graphics.setText(text ? text : "");
            }
        };

        var getGraphicsComponentInstanceForEntityInstance = function (callback, instanceId) {
            var instance = getGraphicsComponentInstance2DAnimation(instanceId);
            if (instance === null) {
                instance = getGraphicsComponentInstanceFont(instanceId);
            }
            if (instance !== null) {
                callback(instance);
            }
        };

        this.removeGraphicsComponentInstanceFromMessage = function (instanceId) {
            for (var z = 0, zEnd = zOrders.length; z < zEnd; ++z) {
                for (var rp = 0, rpEnd = renderPasses.length; rp < rpEnd; ++rp) {
                    if (gfx2DAnimationInstances[z][rp].length > 0) {
                        for (var k = 0; k < gfx2DAnimationInstances[z][rp].length; ++k) {
                            if (gfx2DAnimationInstances[z][rp][k].instanceId === instanceId) {
                                gfx2DAnimationInstances[z][rp][k].destroy(messengerEngine);
                                gfx2DAnimationInstances[z][rp].splice(k, 1);
                                return;
                            }
                        }
                    }

                    if (gfxFontInstances[z][rp].length > 0) {
                        for (var k = 0; k < gfxFontInstances[z][rp].length; ++k) {
                            if (gfxFontInstances[z][rp][k].instanceId === instanceId) {
                                gfxFontInstances[z][rp][k].destroy(messengerEngine);
                                gfxFontInstances[z][rp].splice(k, 1);
                                return;
                            }
                        }
                    }
                }
            }
        };

        messengerEngine.register("setShaderProgram", this, setShaderProgram);
        messengerEngine.register("setInstanceAnimationState", this, setInstanceAnimationState);
        messengerEngine.register("setInstanceAnimationFrame", this, setInstanceAnimationFrame);
        messengerEngine.register("setInstanceText", this, setInstanceText);
        messengerEngine.register("clearInstanceText", this, setInstanceText);
        messengerEngine.register("getGraphicsComponentInstanceForEntityInstanceRequest", this, getGraphicsComponentInstanceForEntityInstance);
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
}(window.TTTD = window.TTTD || {}));