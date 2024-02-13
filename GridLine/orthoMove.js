//  export function orthoCamera() {
const canvas = document.getElementById("gridline");
const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("webGL is not supported in your browser")
}
//create source
const vertexSource = `
    attribute vec4 a_position;
    uniform mat4 u_matrix;
    void main(){
        gl_Position = u_matrix * a_position ;
    }`;
const fragmentSource = `
    void main(){
        gl_FragColor= vec4(0.0, 1.0, 0.0, 0.0);
    }`;

//create shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentSource)
gl.compileShader(fragmentShader)

//create program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

//grid lines
const vertexData = [];
let gridSize =100;
let isDragging = false;
const spacing = 0.1;
// function grid(gridSize) {
    // canvas.addEventListener("mousemove",()=>{
    //     if (isDragging) {
    //             gridSize++;
    //             for (let i = -gridSize; i <= gridSize; i++){
    //                 vertexData.push(-gridSize, i * spacing, 0.0)
    //                 vertexData.push(gridSize, i * spacing, 0.0)
    //                 vertexData.push(i * spacing, -gridSize, 0.0)
    //                 vertexData.push(i * spacing, gridSize, 0.0)
    //             } 
    //             upgrid() 
    //         }
    //     })  
// }
// grid(gridSize)

    for (let i = -gridSize; i <= gridSize; i++) {
            vertexData.push(-gridSize, i * spacing, 0.0)
            vertexData.push(gridSize, i * spacing, 0.0)
            vertexData.push(i * spacing, -gridSize, 0.0)
            vertexData.push(i * spacing, gridSize, 0.0)
} 

// grid points
// for (let i = -gridSize; i <= gridSize; i++) {
//         for (let j = -gridSize; j <= gridSize; j++) {
//                 vertexData.push(i * spacing, j * spacing, 0.0);
//             }
//         }
        
        
        //create buffer
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
        
        //get position
        const positionLoc = gl.getAttribLocation(shaderProgram, 'a_position');
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

const projectionMatrix = mat4.create();
const viewMatrix = mat4.create();
const modelViewMatrix = mat4.create();
const mvpMatrix = mat4.create();
let aspectRatio = (canvas.width / canvas.height);
mat4.ortho(projectionMatrix, -aspectRatio , aspectRatio , -1, 1, -1, 1);

//Zoom in & out
const uniLocation = gl.getUniformLocation(shaderProgram, 'u_matrix');
gl.uniformMatrix4fv(uniLocation, false, viewMatrix);
let valueX = 0;
let valueY = 0;
let valueZ = 0;

//initial the scalling
let scaling = 1.0;
canvas.addEventListener("wheel", (e) => {
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    scaling += delta;
    scaling = Math.max(0.1, scaling)

    //set the values into mat4 matrix
    mat4.identity(viewMatrix);
    mat4.scale(viewMatrix, viewMatrix, [scaling, scaling, 1.0])
    upgrid();
    if (delta > 0.1) {
        valueZ = 1;
    }
    else if (delta < 0.1) {
        valueZ = -1;

    }
    else {
        valueZ = 1;

    }
});
function upgrid() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, vertexData.length);
    // gl.drawArrays(gl.POINTS, 0, vertexData.length);
    mat4.multiply(modelViewMatrix, viewMatrix, projectionMatrix);
    gl.uniformMatrix4fv(uniLocation, false, modelViewMatrix);
};

//mouse events

let lastX, lastY;
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
        isDragging = true;
        lastX = e.clientX;
        console.log('lastX: ', lastX);
        lastY = e.clientY;
    }
});
canvas.addEventListener('mousemove', (e) => {
    if (isDragging && e.button === 0) {
        const delX = e.clientX - lastX;
        console.log('delX: ', delX);
        const delY = e.clientY - lastY;
        const NewValueX = e.clientX
        const NewValueY = e.clientY
        
        if (e.button === 0 && NewValueX < lastX) {
            valueX++
        }
        else if (e.button === 0 && NewValueX > lastX) {
            valueX--
        }
        if (e.button === 0 && NewValueY < lastY) {
            valueY--
        }
        else if (e.button === 0 && NewValueY > lastY) {
            valueY++
        }
        let transX = delX / canvas.width
        let transY = -delY / canvas.height
        mat4.translate(viewMatrix, viewMatrix, [transX, transY, 0]);
        upgrid();
        valueX += transX
        valueY -= -transY
       
    }
    lastX = e.clientX;
    lastY = e.clientY;
});
canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        isDragging = false;
    }
});
upgrid();
// function render(x) {
    
//    requestAnimationFrame(render)
// }
// render(gridSize)