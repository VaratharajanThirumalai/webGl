    let scalingSizeX=document.getElementById("scaleX");
    let scalingSizeY=document.getElementById("scaleY");
    let TranslateValueX=document.getElementById("TranslateX");
    let TranslateValueY=document.getElementById("TranslateY");
    const canvas = document.getElementById("gridline");
    const gl = canvas.getContext("webgl");
    if (!gl) {
        console.error('WebGL is not supported in your browser.');
    }
    // Define vertices for a rectangle
    const vertices = new Float32Array([
        0.5, -0.5, // Bottom-left vertex
        0.5,  0.5, // Bottom-right vertex
        - 0.5,  0.5,    // Top-right vertex
        - 0.5, -0.5 // Top-left vertex
]);
// Define indices to form two triangles for the rectangle
const indices = new Uint16Array([
    0, 1, 2,   // First triangle
    0, 2, 3    // Second triangle
]);
// Vertex shader source code
const vertexSource = `
attribute vec4 a_position;
uniform mat4 u_matrix;
void main() {
    gl_Position = u_matrix * a_position;
}`;
// Fragment shader source code
const fragmentSource = `
// precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
}`;
// Create and compile vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexSource);
gl.compileShader(vertexShader);
// Create and compile fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentSource);
gl.compileShader(fragmentShader);
// Create a shader program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);
// Create a buffer for the vertices
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
// Create a buffer for the indices
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices,gl.STATIC_DRAW);
// Get the attribute location and enable it
const positionLoc = gl.getAttribLocation(shaderProgram, 'a_position');
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc,2, gl.FLOAT, false, 0, 0); 
const projectionMatrix=mat4.create();       
const viewMatrix=mat4.create();
const modelViewMatrix=mat4.create();
const mvpMatrix=mat4.create();
// mat4.ortho(projectionMatrix,-1,1,-1,1,-1,1);
  let aspectRatio = (canvas.width / canvas.height);
  mat4.ortho(projectionMatrix, -aspectRatio , aspectRatio, -1, 1, -1, 1);
  const uniLocation = gl.getUniformLocation(shaderProgram, 'u_matrix');
  gl.uniformMatrix4fv(uniLocation, false, viewMatrix);
  function upgrid(){
 gl.clearColor(0.0, 0.0, 0.0, 1.0);
 gl.clear(gl.DEPTH_BUFFER_BIT );
 gl.clear(gl.COLOR_BUFFER_BIT );
 gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
 mat4.multiply(modelViewMatrix,viewMatrix,projectionMatrix);
 gl.uniformMatrix4fv(uniLocation, false, modelViewMatrix);
 }
// translate & scaling
  let  isDragging=false;
  let lastX,lastY;
 let transX ,transY;
 let scalingx = 1.0
  let scalingy =1.0
  let valueX=0,valueY=0;
 canvas.addEventListener('mousedown',(e)=>{
   if(e.button===0){
      isDragging=true;
       lastX = e.clientX;
       lastY = e.clientY;
     } })
    canvas.addEventListener('mousemove',(e)=>{
   if (isDragging) {
     const delX = e.clientX - lastX;
    const delY = e.clientY - lastY;
   const newValueX=e.clientX
   const newValueY=e.clientY  
   if (e.button===0 && newValueX<lastX) {
       valueX++;
 }
  else if (e.button===0 && newValueX>lastX) {
      valueX--;
    }
    if (e.button===0 && newValueY<lastY) {
        valueY++;
    }
    else if (e.button===0 && newValueY>lastY) {
        valueY--;
    }
    if (e.shiftKey === true) {  
     transX=delX / canvas.width
      transY=-delY / canvas.height
      valueX+=transX;
       valueY-=-transY;
       mat4.translate(viewMatrix,viewMatrix,[transX,transY,0]);
       TranslateValueX.innerHTML=Math.floor(valueX);
       TranslateValueY.innerHTML=Math.floor(valueY);
   }
 if(e.ctrlKey === true){
    const newX = e.clientX      
 if (lastX > newX) {
        scalingx +=0.1;   
  } else if (lastX < newX) {
     scalingx -=0.1; 
  }
 }
if(e.altKey === true){
   const newY = e.clientY
  if (lastY < newY) {
     scalingy+=0.1;                           
     } else if (lastY > newY) { 
     scalingy-=0.1;   
     } 
 }                  
   scalingSizeX.innerHTML=Math.floor(scalingx);
   scalingSizeY.innerHTML=Math.floor(scalingy);
   upgrid();
  lastX = e.clientX;
  lastY = e.clientY;      
 }
});
canvas.addEventListener('mouseup',(e)=>{
    if(e.button===0){
        isDragging=false;
    }   })
    upgrid();
    function render(){
        mat4.identity(projectionMatrix);
        mat4.scale(projectionMatrix, projectionMatrix, [scalingx,scalingy, 1.0])
        requestAnimationFrame(render)
    }
  render();


    // ================================================================================================
    
    
    //         const canvas = document.getElementById("gridline");
    //         const gl = canvas.getContext("webgl");
    
    //         if (!gl) {
        //             
        //         }
        
        //         // Define pixel data for the rectangle
        //         const pixelData = new Uint8Array([
        //             255, 0, 0, 255, // Red color (R, G, B, A)
        //             0, 255, 0, 255, // Green color
        //             0, 0, 255, 255, // Blue color
        //             255, 255, 0, 255 // Yellow color
        //         ]);
        
        //         // Create a WebGL texture
        //         const texture = gl.createTexture();
        //         gl.bindTexture(gl.TEXTURE_2D, texture);
        //         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);
        
        //         // Set up shaders
        //         const vertexSource = `
        //             attribute vec2 a_position;
        //             varying vec2 v_texCoord;
        //             void main() {
        //                 gl_Position = vec4(a_position, 0.0, 1.0);
        //                 v_texCoord = a_position * 0.5 + 0.5;
        //             }`;
        
        //         const fragmentSource = `
        //             precision mediump float;
        //             varying vec2 v_texCoord;
        //             uniform sampler2D u_texture;
        //             void main() {
        //                 gl_FragColor = texture2D(u_texture, v_texCoord);
        //             }`;
        
        //         // Create shaders and program as before
        //         // Create and compile vertex shader
        //         const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        //         gl.shaderSource(vertexShader, vertexSource);
        //         gl.compileShader(vertexShader);
        
        //         // Create and compile fragment shader
        //         const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        //         gl.shaderSource(fragmentShader, fragmentSource);
        //         gl.compileShader(fragmentShader);
        // const shaderProgram = gl.createProgram();
        // gl.attachShader(shaderProgram, vertexShader);
        // gl.attachShader(shaderProgram, fragmentShader);
        // gl.linkProgram(shaderProgram);
        // gl.useProgram(shaderProgram);
        //         // Get the attribute location and enable it
        //         const positionLoc = gl.getAttribLocation(shaderProgram, 'a_position');
        //         gl.enableVertexAttribArray(positionLoc);
        //         gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
        
        //         // Get the uniform location for the texture
        //         const textureLoc = gl.getUniformLocation(shaderProgram, 'u_texture');
        //         gl.uniform1i(textureLoc, 0); // Set the texture unit to 0
        
        //         // Draw the rectangle
        //         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            