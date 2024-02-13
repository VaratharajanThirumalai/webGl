export function uniformLocation(gl, shaderLocation, Matrix, location) {
    let MatrixLocation = gl.getUniformLocation(shaderLocation, location);
    gl.uniformMatrix4fv(MatrixLocation, false, Matrix);
    return MatrixLocation;
}
export function positionLocation(gl, shaderLocation, location,number) {
    const positionAttributeLocation = gl.getAttribLocation(shaderLocation, location);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, number, gl.FLOAT, false, 0, 0);
}
export function vertexBuffer(gl, vertices) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return vertexBuffer;
}
export function indexBuffer(gl, indices) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    return indexBuffer;
}
export function vertexShader(gl, source) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, source);
    gl.compileShader(vertexShader);
    return vertexShader;
}
export function fragmentShader(gl, source) {
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, source);
    gl.compileShader(fragmentShader);
    return fragmentShader;
}
export function shaderProgram(gl, vertex, fragment) {
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertex);
    gl.attachShader(shaderProgram, fragment);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    return shaderProgram;
}