(function () {
    var headElem = document.getElementsByTagName("head")[0];
    if (headElem !== undefined &&
        headElem !== null &&
        GfxEngine !== undefined &&
        GfxEngine.shaderList !== undefined &&
        GfxEngine.compileShader !== undefined) {
        var shaderList = GfxEngine.shaderList;
        var compileShader = GfxEngine.compileShader;

        var shaderName = "PointLight";
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
            "uniform vec2 u_lightPosition;" + "\r\n" +
            "uniform float u_lightRadius;" + "\r\n" +
            "uniform vec3 u_lightColor;" + "\r\n" +
            "uniform vec3 u_colorInversion;" + "\r\n" +
            "" + "\r\n" +
            "varying vec2 v_texCoord;" + "\r\n" +
            "varying vec2 v_worldCoord;" + "\r\n" +
            "varying vec2 v_resolution;" + "\r\n" +
            "" + "\r\n" +
            "void main() {" + "\r\n" +
            "    vec2 lightPosition = u_lightPosition / v_resolution;" + "\r\n" +
            "" + "\r\n" +
            "    float dist = abs(distance(vec2(lightPosition.x, 1.0 - lightPosition.y), vec2(v_worldCoord.x, 1.0 - v_worldCoord.y)));" + "\r\n" +
            "" + "\r\n" +
            "    float alph = clamp(u_lightRadius - dist + .15, 0.0, 1.0);" + "\r\n" +
            "" + "\r\n" +
            "    gl_FragColor = vec4((texture2D(u_image, v_texCoord).rgb - u_colorInversion) * u_lightColor.rgb, alph);" + "\r\n" +
            "}";
            headElem.appendChild(fragmentShader);

            var FragmentShaderPointLightExtraSteps = function () {
                var lightTransform = {
                    position: {
                        x: 0,
                        y: 0
                    }
                };
                var lightRadius = 0.45;
                var lightColor = {
                    r: 1.0,
                    g: 1.0,
                    b: 1.0
                };
                var colorInversion = {
                    r: 0.0,
                    g: 0.0,
                    b: 0.0
                };

                var setPointLightTransform = function (transformation) {
                    lightTransform = transformation;
                };

                var setPointLightRadius = function (radius) {
                    lightRadius = radius;
                };

                var setPointLightColor = function (color) {
                    if (color.r !== undefined && color.r !== null) {
                        lightColor.r = color.r;
                    }
                    if (color.g !== undefined && color.g !== null) {
                        lightColor.g = color.g;
                    }
                    if (color.b !== undefined && color.b !== null) {
                        lightColor.b = color.b;
                    }
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
                    var lightPositionLocation = gl.getUniformLocation(prgrm, "u_lightPosition");
                    if (lightPositionLocation != null) {
                        gl.uniform2f(lightPositionLocation, lightTransform.position.x, lightTransform.position.y);
                    }
                    var lightRadiusLocation = gl.getUniformLocation(prgrm, "u_lightRadius");
                    if (lightRadiusLocation != null) {
                        gl.uniform1f(lightRadiusLocation, lightRadius);
                    }
                    var lightColorLocation = gl.getUniformLocation(prgrm, "u_lightColor");
                    if (lightColorLocation != null) {
                        gl.uniform3f(lightColorLocation, lightColor.r, lightColor.g, lightColor.b);
                    }
                    var lightColorLocation = gl.getUniformLocation(prgrm, "u_colorInversion");
                    if (lightColorLocation != null) {
                        gl.uniform3f(lightColorLocation, colorInversion.r, colorInversion.g, colorInversion.b);
                    }
                };

                globalMessengerEngine.register("setPointLightTransform", this, setPointLightTransform);
                globalMessengerEngine.register("setPointLightRadius", this, setPointLightRadius);
                globalMessengerEngine.register("setPointLightColor", this, setPointLightColor);
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
            "varying vec2 v_worldCoord;" + "\r\n" +
            "varying vec2 v_resolution;" + "\r\n" +
            "" + "\r\n" +
            "void main() {" + "\r\n" +
            "    vec2 zeroToOne = a_position / u_resolution;" + "\r\n" +
            "    " + "\r\n" +
            "    vec2 zeroToTwo = zeroToOne * 2.0;" + "\r\n" +
            "    " + "\r\n" +
            "    vec2 clipSpace = zeroToTwo - 1.0;" + "\r\n" +
            "    " + "\r\n" +
            "    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);" + "\r\n" +
            "    " + "\r\n" +
            "    v_texCoord = a_texCoord;" + "\r\n" +
            "    v_worldCoord = zeroToOne;" + "\r\n" +
            "    v_resolution = u_resolution;" + "\r\n" +
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
}());