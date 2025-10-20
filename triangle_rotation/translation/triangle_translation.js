var gl;
var theta = 0;
var scale = 1.0;
var growing = true;
var tx = 0.0;
var movingRight = true;

var thetaLoc, scaleLoc, txLoc;

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
    txLoc    = gl.getUniformLocation(program, "tx");

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += 0.5;

    var stepScale = 0.005;
    if (growing) {
        scale += stepScale;
        if (scale >= 2.0) growing = false;
    } else {
        scale -= stepScale;
        if (scale <= 0.5) growing = true;
    }

    var stepTx = 0.005;
    if (movingRight) {
        tx += stepTx;
        if (tx >= 0.5) movingRight = false;
    } else {
        tx -= stepTx;
        if (tx <= -0.5) movingRight = true;
    }

    gl.uniform1f(thetaLoc, theta);
    gl.uniform1f(scaleLoc, scale);
    gl.uniform1f(txLoc, tx);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimFrame(render);
}
