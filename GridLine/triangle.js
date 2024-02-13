// export function triangle(x,y,z) {
const canvas = document.getElementById('gridline');
const gl = canvas.getContext('webgl');

let vertexData = [
    0.0, 0.05, 0.0,
    -0.05, -0.05, 0.0,
    0.05, -0.05, 0.0,
];
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);


const vertexSource = `
    attribute vec4 a_position;
    uniform mat4 u_matrix;
    void main(){
        gl_Position= u_matrix * a_position ;
}`;

const fragmentSource = `
    void main(){
        gl_FragColor= vec4(1.0 ,1.0 ,1.0 ,1.0);
}`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentSource)
gl.compileShader(fragmentShader)

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);


let positionLoc = gl.getAttribLocation(program, 'a_position')
gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(positionLoc)


const matrix = mat4.create();
mat4.ortho(matrix, 0, gl.viewportWidth, 0, gl.viewportHeight, 0.1, 200)
mat4.translate(matrix, matrix, [0, 0, 0]);
// mat4.translate(matrix, matrix, [x, y, z]);
// const projectionMatrix = mat4.create();
const uniformLocation = {
    matrix: gl.getUniformLocation(program, 'u_matrix')
}

// const uniLocation = gl.getUniformLocation(program, 'matrix')
gl.uniformMatrix4fv(uniformLocation.matrix, false, matrix)
gl.drawArrays(gl.TRIANGLES, 0, vertexData.length)
gl.clear(gl.COLOR_BUFFER_BIT);
// }
// export function triangle(x, y, z) {
//     const canvas = document.getElementById('gridline');
//     const gl = canvas.getContext('webgl');

//     if (!gl) {
//         console.error("WebGL is not supported in your browser");
//         return;
//     }

    // Define the vertex data for a triangle
//     let vertexData = [
//         0.0, 0.05, 0.0,
//         -0.05, -0.05, 0.0,
//         0.05, -0.05, 0.0,
//     ];

//     const buffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

//     const vertexSource = `
//         attribute vec4 a_position;
//         uniform mat4 u_matrix;
//         void main() {
//             gl_Position = u_matrix * a_position;
//         }`;

//     const fragmentSource = `
//         void main() {
//             gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // Use alpha value 1.0 for full opacity
//         }`;

//     const vertexShader = gl.createShader(gl.VERTEX_SHADER);
//     gl.shaderSource(vertexShader, vertexSource);
//     gl.compileShader(vertexShader);

//     const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//     gl.shaderSource(fragmentShader, fragmentSource);
//     gl.compileShader(fragmentShader);

//     const program = gl.createProgram();
//     gl.attachShader(program, vertexShader);
//     gl.attachShader(program, fragmentShader);
//     gl.linkProgram(program);
//     gl.useProgram(program);

//     let positionLoc = gl.getAttribLocation(program, 'a_position');
//     gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(positionLoc);

//     const matrix = mat4.create();
//     mat4.ortho(matrix, 0, canvas.width, 0, canvas.height, 0.1, 200);
//     mat4.translate(matrix, matrix, [x, y, z]);

//     const uniformLocation = {
//         matrix: gl.getUniformLocation(program, 'u_matrix')
//     };

//     gl.uniformMatrix4fv(uniformLocation.matrix, false, matrix);
//     gl.drawArrays(gl.TRIANGLES, 0, vertexData.length);
// }
