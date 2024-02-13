export const vertexShaderSource = `
        precision mediump float;
        attribute vec4 a_position;
        uniform mat4 uViewMatrix;
        uniform mat4 uModelMatrix;
        uniform mat4 uProjectionMatrix;
        void main() {
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * a_position;
        }`;
export const vertexShaderSourceForColision = `
        attribute vec4 a_position;
        uniform float deformationFactor;
        uniform mat4 u_modelMatrix;
        uniform mat4 u_ViewMatrix;
        uniform mat4 u_projectionMatrix;
        void main() {
                vec4 deformedPosition = a_position + vec4(0.0, 0.0, deformationFactor, 0.0);
          gl_Position = u_projectionMatrix * u_ViewMatrix *  u_modelMatrix * deformedPosition;
        }
        `;

export const fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 0.0);
        }
        `;
export const fragmentSource = `
        precision mediump float;
        uniform vec4 u_color;
        void main() {
          gl_FragColor = u_color;
        }`;
export const vsSource = `
        attribute vec4 aVertexPosition;
        uniform mat4 uViewMatrix;
        uniform mat4 uModelMatrix;
        uniform mat4 uProjectionMatrix;
 
        void main(void) {
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;

        }`;

export const fsSource = `
        precision mediump float;
        uniform vec3 uCubeColor;
        void main(void) {
        gl_FragColor =  vec4(uCubeColor, 1.0);
        }`