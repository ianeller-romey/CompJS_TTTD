(function () {
    var headElem = document.getElementsByTagName("head")[0];
    if (headElem !== undefined &&
        headElem !== null &&
        GfxEngine !== undefined &&
        GfxEngine.shaderList !== undefined &&
        GfxEngine.compileShader !== undefined) {
        var shaderList = GfxEngine.shaderList;
        var compileShader = GfxEngine.compileShader;

        var shaderName = "TextureColorChange";
        if (shaderList[shaderName] === undefined || shaderList[shaderName] === null) {
            var fragmentShaderName = "fragmentShader-" + shaderName;
            var vertexShaderName = "vertexShader-" + shaderName;
            
            /****************/
            /* FRAGMENT SHADER */
            /****************/
            var fragmentShader = document.createElement("script");
            fragmentShader.setAttribute("id", fragmentShaderName);
            fragmentShader.setAttribute("type", "x-shader/x-fragment");
            fragmentShader.text = "" + "\r\n" +
            "precision mediump float;" + "\r\n" +
            "" + "\r\n" +
            "uniform sampler2D u_image;" + "\r\n" +
            "uniform vec3 u_colorInversion;" + "\r\n" +
            "" + "\r\n" +
            "varying vec2 v_texCoord;" + "\r\n" +
            "" + "\r\n" +
            "void main() {" + "\r\n" +
            "" + "\r\n" +
            "    vec4 color = texture2D(u_image, v_texCoord);" + "\r\n" +
            "    gl_FragColor = vec4(color.rgb - u_colorInversion, color.a);" + "\r\n" +
            "}";
            headElem.appendChild(fragmentShader);

            var FragmentShaderTextureColorChangeSteps = function () {
                var colorInversion = {
                    r: 0.0,
                    g: 0.0,
                    b: 0.0
                };

                var setColorInversion = function (color) {
                    if (color.r !== undefined && color.r !== null) {
                        colorInversion.r = color.r;
                    }
                    if (color.g !== undefined && color.g !== null) {
                        colorInversion.g = color.g;
                    }
                    if (color.b !== undefined && color.b !== null) {
                        colorInversion.b = color.b;
                    }
                };

                this.extraSteps = function (gl, prgrm) {
                    var lightColorLocation = gl.getUniformLocation(prgrm, "u_colorInversion");
                    if (lightColorLocation != null) {
                        gl.uniform3f(lightColorLocation, colorInversion.r, colorInversion.g, colorInversion.b);
                    }
                };

                globalMessengerEngine.register("setColorInversion", this, setColorInversion);
            };
            /****************/
            /* FRAGMENT SHADER */
            /****************/

            /****************/
            /* VERTEX SHADER */
            /****************/
            var vertexShader = document.createElement("script");
            vertexShader.setAttribute("id", vertexShaderName);
            vertexShader.setAttribute("type", "x-shader/x-vertex");
            vertexShader.text = "" + "\r\n" +
            "attribute vec2 a_position;" + "\r\n" +
            "attribute vec2 a_texCoord;" + "\r\n" +
            "" + "\r\n" +
            "uniform vec2 u_resolution;" + "\r\n" +
            "" + "\r\n" +
            "varying vec2 v_texCoord;" + "\r\n" +
            "" + "\r\n" +
            "void main() {" + "\r\n" +
            "    // convert the rectangle from pixels to 0.0 to 1.0" + "\r\n" +
            "    vec2 zeroToOne = a_position / u_resolution;" + "\r\n" +
            "    " + "\r\n" +
            "    // convert from 0->1 to 0->2" + "\r\n" +
            "    vec2 zeroToTwo = zeroToOne * 2.0;" + "\r\n" +
            "    " + "\r\n" +
            "    // convert from 0->2 to -1->+1 (clipspace)" + "\r\n" +
            "    vec2 clipSpace = zeroToTwo - 1.0;" + "\r\n" +
            "    " + "\r\n" +
            "    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);" + "\r\n" +
            "    " + "\r\n" +
            "    // pass the texCoord to the fragment shader" + "\r\n" +
            "    // The GPU will interpolate this value between points." + "\r\n" +
            "    v_texCoord = a_texCoord;" + "\r\n" +
            "}";
            headElem.appendChild(vertexShader);
            /****************/
            /* VERTEX SHADER */
            /****************/

            shaderList.push({
                name: shaderName,
                init: function (gl, index) {
                    var shaderProgram = compileShader(gl, fragmentShaderName, vertexShaderName);
                    shaderList[index].program = shaderProgram;

                    shaderList[index].vertexShaderExtraSteps = null;

                    var shaderExtraSteps = new FragmentShaderTextureColorChangeSteps();
                    shaderList[index].fragmentShaderExtraSteps = shaderExtraSteps.extraSteps;
                }
            });
        }
    }
}());