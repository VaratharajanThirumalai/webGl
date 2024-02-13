import * as master from './Mainexport.js'
export function Cube(canvas, gl,a,X,Y,Z) {
    let vsSource = master.vsSource
    let fsSource = master.fsSource
    const vertexShader = master.vertexShader(gl, vsSource);
    const fragmentShader = master.fragmentShader(gl, fsSource);
    const program = master.shaderProgram(gl, vertexShader, fragmentShader);
    let vertices = master.vertices;
    let indices = master.indices
    master.vertexBuffer(gl, vertices);
    master.indexBuffer(gl, indices);
    master.positionLocation(gl, program, 'aVertexPosition', 3);
    const projectionMatrix = mat4.create();
    const ViewMatrix = mat4.create();
    const ModelMatrix = mat4.create();
    mat4.translate(ModelMatrix,ModelMatrix,[0,-5,a])
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 0.1, 100.0);
    mat4.lookAt(ViewMatrix, [0,-20,7], [0, 0, 0], [0, 1, 0]);
    master.uniformLocation(gl, program, ModelMatrix, 'uModelMatrix');
    master.uniformLocation(gl, program, ViewMatrix, 'uViewMatrix');
    master.uniformLocation(gl, program, projectionMatrix, 'uProjectionMatrix');
    const cubeColorLocation = gl.getUniformLocation(program, 'uCubeColor');
    gl.uniform3fv(cubeColorLocation, [1.0, 0.0, 0.0]);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}