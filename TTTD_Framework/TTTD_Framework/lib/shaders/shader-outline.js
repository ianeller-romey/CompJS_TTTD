(function (namespace, undefined) {
    "use strict";

    var headElem = document.getElementsByTagName("head")[0];
    if (headElem !== undefined &&
        headElem !== null &&
        namespace.Engines.GfxEngine !== undefined &&
        namespace.Engines.GfxEngine.shaderList !== undefined &&
        namespace.Engines.GfxEngine.compileShader !== undefined) {
        var shaderList = namespace.Engines.GfxEngine.shaderList;
        var compileShader = namespace.Engines.GfxEngine.compileShader;

        var shaderName = "Outline";
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
            "uniform vec2 u_stepSize;" + "\r\n" +
            "" + "\r\n" +
            "varying vec2 v_texCoord;" + "\r\n" +
            "" + "\r\n" +
            "void main() {" + "\r\n" +
            "" + "\r\n" +
            "    float alph = 4.0 * texture2D(u_image, v_texCoord).a;" + "\r\n" + 
            "    alph -= texture2D(u_image, v_texCoord + vec2(u_stepSize.x, 0.0)).a;" + "\r\n" +
            "    alph -= texture2D(u_image, v_texCoord + vec2(-u_stepSize.x, 0.0)).a;" + "\r\n" +
            "    alph -= texture2D(u_image, v_texCoord + vec2(0.0, u_stepSize.y)).a;" + "\r\n" +
            "    alph -= texture2D(u_image, v_texCoord + vec2(0.0, -u_stepSize.y)).a;" + "\r\n" +
            "    gl_FragColor = vec4(0.2, 1.0, 0.1, alph);" + "\r\n" +
            "}";
            headElem.appendChild(fragmentShader);

            var FragmentShaderPointLightExtraSteps = function () {
                this.extraSteps = function (webGL, webGLShaderProgram, textureInformation) {
                    var stepSizeLocation = webGL.getUniformLocation(webGLShaderProgram, "u_stepSize");
                    if (stepSizeLocation != null) {
                        webGL.uniform2f(stepSizeLocation, textureInformation.stepX * 3, textureInformation.stepY * 3);
                    }
                };
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

                    var shaderExtraSteps = new FragmentShaderPointLightExtraSteps();
                    shaderList[index].fragmentShaderExtraSteps = shaderExtraSteps.extraSteps;
                }
            });
        }
    }
}(window.TTTD = window.TTTD || {}));