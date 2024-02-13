//normal circle
// const canvas = document.getElementById("gridline");
// const gl = canvas.getContext("webgl");

// if (!gl) {
//     console.error("webGL is not supported in your browser")
// }

// const numSegments = 2000;
// const radius = 0.5;
// const vertexData = [];
// for (let i = 0; i <= numSegments; i++) {
//     const angle = (i / numSegments) * Math.PI * 2;
//     const x = Math.cos(angle) * radius;
//     const y = Math.sin(angle) * radius;
//     vertexData.push(x, y, 0.0);
// }
// //create buffer
// const buffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// //create source
// const vertexSource = `
// attribute vec4 a_position;
// void main() {
//     gl_Position = a_position;
// }`;
// const fragmentSource = `
// void main(){
//     gl_FragColor= vec4(1.0, 1.0, 1.0,1.0);
// }`;

// //create shader
// const vertexShader = gl.createShader(gl.VERTEX_SHADER);
// gl.shaderSource(vertexShader, vertexSource);
// gl.compileShader(vertexShader);

// const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// gl.shaderSource(fragmentShader, fragmentSource)
// gl.compileShader(fragmentShader)


// // let s = gl.createShader((type == 'vertex') ?
// //     gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
// // gl.shaderSource(s, vertexSource);
// // gl.compileShader(s)

// //create program
// const shaderProgram = gl.createProgram();
// gl.attachShader(shaderProgram, vertexShader);
// gl.attachShader(shaderProgram, fragmentShader);
// gl.linkProgram(shaderProgram);
// gl.useProgram(shaderProgram);

// //get position
// gl.clearColor(0.0, 0.0, 0.0, 1.0);
// // gl.clear(gl.COLOR_BUFFER_BIT);
// const positionLoc = gl.getAttribLocation(shaderProgram, 'a_position');
// gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
// gl.enableVertexAttribArray(positionLoc);
// gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexData.length)

 ////one color circle
 
// const canvas = document.querySelector('canvas');
// const gl = canvas.getContext('webgl');

// const outerradius = 0.5;
// let innerradius = 0.3;
// const segments = 100;
// const vertexData = [];

// // Calculate the outer circle's vertex positions
// for (let i = 0; i <= segments; i++) {
//     const theta = (i / segments) * Math.PI * 2;
//     const xouter = outerradius * Math.cos(theta);
//     const youter = outerradius * Math.sin(theta);
//     vertexData.push(xouter, youter, 0.0);
// }

// // Calculate the inner circle's vertex positions
// for (let i = 0; i <= segments; i++) {
//     const theta = (i / segments) * Math.PI * 2;
//     const xinner = innerradius * Math.cos(theta);
//     const yinner = innerradius * Math.sin(theta);
//     vertexData.push(xinner, yinner, 0.0);
// }

// // Add vertices for the filled region
// for (let i =0; i <= segments; i++) {
//     const theta = (i / segments) * Math.PI * 2;
//     const xouter = outerradius * Math.cos(theta);
//     const youter = outerradius * Math.sin(theta);
//     const xinner = innerradius * Math.cos(theta);
//     const yinner = innerradius * Math.sin(theta);
//     vertexData.push(xouter, youter, 0.0);
//     vertexData.push(xinner, yinner, 0.0);
// }

// const buffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// const vertexshadersource = `
// attribute vec4 position;
// uniform mat4 u_Matrix;
// void main() {
//     gl_Position = u_Matrix * position;
// }`;

// const vertexShader = gl.createShader(gl.VERTEX_SHADER);
// gl.shaderSource(vertexShader, vertexshadersource);
// gl.compileShader(vertexShader);

// const fragmentshadersource = `
// void main() {
//     gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
// }`;

// const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// gl.shaderSource(fragmentShader, fragmentshadersource);
// gl.compileShader(fragmentShader);

// const program = gl.createProgram();
// gl.attachShader(program, vertexShader);
// gl.attachShader(program, fragmentShader);
// gl.linkProgram(program);
// gl.useProgram(program);

// let position;
// let positionLocation = gl.getAttribLocation(program, 'position');
// gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
// gl.enableVertexAttribArray(positionLocation);

// const projectionMatrix = mat4.create();
// const viewMatrix = mat4.create();
// const modelMatrix = mat4.create();
// const mvpMatrix = mat4.create();
// const aspectRatio = canvas.width / canvas.height;
// mat4.ortho(projectionMatrix, -aspectRatio, aspectRatio, -1, 1, -1, 1);

// function updateGrid() {
//     mat4.multiply(modelMatrix, viewMatrix, projectionMatrix);
//     gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
//     const MatrixLocation = gl.getUniformLocation(program, 'u_Matrix');
//     gl.uniformMatrix4fv(MatrixLocation, false, modelMatrix);
//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexData.length / 3);
// }

// let click = false;
// let lastX, lastY;
// let scaling = 1.0;

// canvas.addEventListener('mousedown', (e) => {
//     if (e.button === 0) {
//         click = true;
//         lastX = e.clientX;
//         lastY = e.clientY;
//     }
// });

// canvas.addEventListener('mousemove', (e) => {
//     if (!click) return;

//     const deltaX = (e.clientX - lastX) / canvas.width;
//     const deltaY = (e.clientY - lastY) / canvas.height;

//     if (e.shiftKey === true) {
//         mat4.translate(viewMatrix, viewMatrix, [deltaX, -deltaY, 0]);
//     } else if (e.ctrlKey === true) {
//         const newX = e.clientX;
//         const newY = e.clientY;
//         if (lastX < newX) {
//             scaling += 0.01;
//         } else if (lastX > newX) {
//             scaling -= 0.01;
//         }
//         if (lastY < newY) {
//             scaling += 0.01;
//         } else if (lastY > newY) {
//             scaling -= 0.01;
//         }
//         mat4.identity(viewMatrix);
//         mat4.scale(viewMatrix, viewMatrix, [scaling, scaling, 1]);
//     }
//     updateGrid();
//     lastX = e.clientX;
//     lastY = e.clientY;
// });

// canvas.addEventListener('mouseup', () => {
//     click = false;
// });
// updateGrid();

// double color circle
const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

    const outerradius =.5;
    const innerradius =.3;
    const segments = 100;
   const vertexData = [];
   const colors = []
   for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const xouter = (outerradius * Math.cos(theta));
    const youter = (outerradius * Math.sin(theta));
    vertexData.push(xouter, youter, 0.0);
    colors.push(1.0, 0.0, 0.0, 1.0);
}
//  Calculate the innercircle's vertex positions
 for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const xinner = (innerradius * Math.cos(theta));
    const yinner = (innerradius * Math.sin(theta));
    vertexData.push(xinner, yinner, 0.0);
    colors.push(1.0, 1.0, 0.0, 1.0); // Green color for inner circle

}
for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const xO = outerradius * Math.cos(theta);
    const yO = outerradius * Math.sin(theta);
    const xI = innerradius * Math.cos(theta);
    const yI = innerradius * Math.sin(theta);
    vertexData.push(xO, yO, 0.0);
    vertexData.push(xI, yI, 0.0);
    colors.push(1.0, 0.0, 0.0, 1.0); // Red color for outer circle
    colors.push(0.0, 1.0, 0.0, 1.0);
}
const buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW)
//color
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

const vertexshadersource =
`attribute vec4 position;
attribute vec4 color;
uniform mat4 u_Matrix;
varying vec4 vColor;
void main() {
    gl_Position = u_Matrix * position;
    vColor = color;
}`;
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertexshadersource)
gl.compileShader(vertexShader)

const fragmentshadersource = `
precision mediump float;
varying vec4 vColor;
void main() {
    gl_FragColor = vColor;
}`;
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fragmentshadersource)
gl.compileShader(fragmentShader)

const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)
gl.useProgram(program)

let position;
const positionLocation = gl.getAttribLocation(program, `position`)
const colorLocation = gl.getAttribLocation(program, `color`);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation)
gl.enableVertexAttribArray(colorLocation)
const projectionMatrix = mat4.create();
const viewMatrix = mat4.create();
const modelMatrix = mat4.create();
const mvpMatrix = mat4.create();
const aspectRatio = canvas.width / canvas.height;
mat4.ortho(projectionMatrix, -aspectRatio , aspectRatio , -1, 1, -1, 1);
    function updateGrid() {
        mat4.multiply(modelMatrix, viewMatrix, projectionMatrix);
            gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
            const MatrixLocation = gl.getUniformLocation(program, `u_Matrix`);
            gl.uniformMatrix4fv(MatrixLocation, false, modelMatrix);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0,vertexData.length/3);
    } 

    let click = false;
    let lastX, lastY; 
    let scaling = 1.0;  

    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            click = true;
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });
    
canvas.addEventListener('mousemove', (e) => {
    if (!click) return;

    const deltaX = (e.clientX - lastX) / canvas.width;
    const deltaY = (e.clientY - lastY) / canvas.height;

  if (e.shiftKey === true) {
    mat4.translate(viewMatrix, viewMatrix, [deltaX , -deltaY , 0]);     
  }
    else if (e.ctrlKey === true) {
       
            const newX = e.clientX;
            if (lastX < newX) {
                scaling += 0.01;
            } else if (lastX > newX) {
                scaling -= 0.01;    
            }
    mat4.identity(viewMatrix);
    mat4.scale(viewMatrix, viewMatrix, [scaling,  scaling , 1]);
    }
    updateGrid();
    lastX = e.clientX;
    lastY = e.clientY;
});

    canvas.addEventListener('mouseup', () => {
        click = false;
    });
    updateGrid()