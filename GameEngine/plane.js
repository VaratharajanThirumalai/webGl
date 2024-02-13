import * as bawa from './Mainexport.js'
export function Plane(canvas, gl,a) {
    const vertexShaderSource = bawa.vertexShaderSource
    const fragmentShaderSource = bawa.fragmentShaderSource
    let vertices = bawa.generateVertices(a, a);
    bawa.vertexBuffer(gl, vertices);
    const vertexSource = bawa.vertexShader(gl, vertexShaderSource);
    const fragmentSource = bawa.fragmentShader(gl, fragmentShaderSource);
    const shaderprogram = bawa.shaderProgram(gl, vertexSource, fragmentSource);
    bawa.positionLocation(gl, shaderprogram, 'a_position',2);
    const projectionMatrix = mat4.create();
    const ViewMatrix = mat4.create();
    const ModelMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 0.1, 100.0);
    mat4.translate(ModelMatrix,ModelMatrix,[0,-5,0])
    mat4.lookAt(ViewMatrix, [0,-20,7], [0, 0, 0], [0, 1, 0]);
    bawa.uniformLocation(gl, shaderprogram, ViewMatrix, 'uViewMatrix');
    bawa.uniformLocation(gl, shaderprogram, ModelMatrix, 'uModelMatrix');
    bawa.uniformLocation(gl, shaderprogram, projectionMatrix, 'uProjectionMatrix');
    gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);
}