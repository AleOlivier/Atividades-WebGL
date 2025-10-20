var gl;
var theta = 0;
var scale = 1.0;
var limite = true;
var thetaLoc, scaleLoc;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    var vertices = [
        vec4(-0.5, -0.5, 0.0, 1.0),
        vec4( 0.0,  0.5, 0.0, 1.0),
        vec4( 0.5, -0.5, 0.0, 1.0)
    ];

    var colors = [
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0)
    ];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    if (!program) {
        console.error("Erro: shaders não compilados corretamente!");
        return;
    }
    gl.useProgram(program);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    thetaLoc = gl.getUniformLocation(program, "theta");
    scaleLoc = gl.getUniformLocation(program, "scale");

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += 0.5;

    var step = 0.005;
    if (limite) {
        scale += step;
        if (scale >= 2.0) limite = false;
    } else {
        scale -= step;
        if (scale <= 0.5) limite = true;
    }

    gl.uniform1f(thetaLoc, theta);
    gl.uniform1f(scaleLoc, scale);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimFrame(render);
}
