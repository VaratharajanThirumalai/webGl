import * as Game from './Mainexport.js'
export function Collision(canvas, gl, cubePositionsX, cubePositionsY, planePositions, x, y, z) {

    const vertexShaderSource = Game.vertexShaderSourceForColision;
    const fragmentShaderSource = Game.fragmentSource;
    const vertexShader = Game.vertexShader(gl, vertexShaderSource);
    const fragmentShader = Game.fragmentShader(gl, fragmentShaderSource);
    const vertices = Game.vertices;
    const planeVertices = Game.planeVertices;
    const indices = Game.indices;
    const planeIndices = Game.planeIndices;
    const vertexBuffer = Game.vertexBuffer(gl, vertices);
    Game.vertexBuffer(gl, planeVertices);
    const indexBuffer = Game.indexBuffer(gl, indices);
    Game.indexBuffer(gl, planeIndices);
    const program = Game.shaderProgram(gl, vertexShader, fragmentShader);
    let cubepositionsX = cubePositionsX || 0;
    let cubepositionsY = cubePositionsY || 0;
    let planePosition = planePositions || 0;

    const eye = [x, y, z];
    const center = [0, 0, 0];
    const up = [0, 1, 0];
    const planeHalfSize = [5, 0, 5];
    const projectionMatrix = mat4.create();
    const ViewMatrix = mat4.create();
    const modelMatrix = mat4.create();
    mat4.lookAt(ViewMatrix, eye, center, up);
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    const positionAttributeLocation = Game.positionLocation(gl, program, 'a_position', 3);
    const modelMatrixLocation = Game.uniformLocation(gl, program, modelMatrix, 'u_modelMatrix');
    Game.uniformLocation(gl, program, ViewMatrix, 'u_ViewMatrix');
    Game.uniformLocation(gl, program, projectionMatrix, 'u_projectionMatrix');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4fv(colorLocation, [1, 1, 1, 0]);
    mat4.translate(modelMatrix, modelMatrix, [0, planePosition, 0]);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
    gl.drawElements(gl.LINE_LOOP, 6, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const cubeCenter = [cubepositionsX, cubepositionsY, 0];
    const cubeHalfSize = [0.5, 0.5, 0.5];

    const isCollision = Game.checkCollision(cubeCenter, cubeHalfSize, [0, planePosition, 0], planeHalfSize);
    if (isCollision) {
        console.log("Collision detected!");
        gl.uniform4fv(colorLocation, [1, 0, 0, 1]);
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, [cubepositionsX, cubepositionsY, 0]);
        gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
        gl.drawElements(gl.TRIANGLE_STRIP, 36, gl.UNSIGNED_SHORT, 0);
    } else {
        gl.uniform4fv(colorLocation, [0, 1, 1, 1]);
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, [cubepositionsX, cubepositionsY, 0]);
        gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
        gl.drawElements(gl.TRIANGLE_STRIP, 36, gl.UNSIGNED_SHORT, 0);
    }
}
