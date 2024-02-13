const canvas = document.getElementById('gridline');
const gl = canvas.getContext('webgl');

if (!gl) {
    
}
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying vec3 vNormal;
    varying vec4 vColor;
    varying vec3 vViewDirection; 
    varying vec3 vLightDirection;
    
    uniform vec3 uLightDirection;
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vNormal = normalize(mat3(uModelViewMatrix) * aVertexNormal);

        // Set the viewer direction in world space
        vViewDirection = normalize(vec3(uModelViewMatrix * aVertexPosition));
        
        // Set the light direction in world space (you can adjust this vector accordingly)
        vLightDirection = normalize(vec3(uLightDirection)); 
    }`;

const fsSource = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vViewDirection;
varying vec3 vLightDirection;
uniform vec3 uCubeColor;

uniform vec3 uAmbientLightColor; 
uniform vec3 uDiffuseLightColor; 
uniform vec3 uSpecularLightColorFront; 
uniform vec3 uSpecularLightColorBack; 

void main(void) {
vec3 ambientLight = uAmbientLightColor;

// Check if the fragment is facing the viewer
float facingViewer = max(dot(vNormal, -vViewDirection), 0.0);

// Diffuse reflection for both sides
float diffuseStrengthFront = max(dot(vNormal, vLightDirection), 0.0);    
float diffuseStrengthBack = max(dot(-vNormal, vLightDirection), 0.0);

vec3 diffuseColor = uDiffuseLightColor;

// Specular reflection for front side
vec3 reflectDirectionFront = reflect(-vLightDirection, normalize(vNormal)); 
float specularStrengthFront = max(dot(reflectDirectionFront, vViewDirection), 0.0);
specularStrengthFront = pow(specularStrengthFront,32.0); // Shininess factor
vec3 specularColorFront = uSpecularLightColorFront; // Specular light color for front side

vec3 reflectDirectionBack = reflect(vLightDirection, normalize(-vNormal));
float specularStrengthBack = max(dot(reflectDirectionBack, vViewDirection), 0.0);
specularStrengthBack = pow(specularStrengthBack, 256.0); // Shininess factor
vec3 specularColorBack = uSpecularLightColorBack; // Specular light color for back side

// Apply lighting for both sides
vec3 phongReflectionFront = facingViewer * (uAmbientLightColor + diffuseStrengthFront * uDiffuseLightColor + specularStrengthFront * uSpecularLightColorFront);
vec3 phongReflectionBack = facingViewer * (uAmbientLightColor + diffuseStrengthBack * uDiffuseLightColor + specularStrengthBack * uSpecularLightColorBack);

// Combine the reflections from both sides based on the sign of the dot product
vec3 phongReflection = mix(phongReflectionFront, phongReflectionBack, step(0.0, dot(vNormal, vViewDirection)));

gl_FragColor = vec4(phongReflection * uCubeColor, 1.0);
}`

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
function createSphereVertices(radius, latitudeBands, longitudeBands) {
  const vertices = [];
  for (let lat = 0; lat <= latitudeBands; lat++) {
      const theta = (lat * Math.PI) / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let long = 0; long <= longitudeBands; long++) {
          const phi = (long * 2 * Math.PI) / longitudeBands;
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);

          const x = cosPhi * sinTheta;
          const y = cosTheta;
          const z = sinPhi * sinTheta;

          vertices.push(radius * x, radius * y, radius * z);
          vertices.push(x, y, z); // Normal vector
      }
  }

  return vertices;
}

  const vertices = createSphereVertices(1.0,30,30)
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const normals = mat3.create();
const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, 'aVertexPosition');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

const normalAttributeLocation = gl.getAttribLocation(program, 'aVertexNormal');
gl.enableVertexAttribArray(normalAttributeLocation);
gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

const modelViewMatrixLocation = gl.getUniformLocation(program, 'uModelViewMatrix');
const projectionMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix');
const cubeColorLocation = gl.getUniformLocation(program, 'uCubeColor');

const projectionMatrix = mat4.create();
const modelViewMatrix = mat4.create();

mat4.perspective(projectionMatrix, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 0.1, 100.0);
mat4.lookAt(modelViewMatrix, [0, 0, 8], [0, 0, 0], [0, 1, 0]);
// gl.viewport(0, 0, canvas.width, canvas.height);
const ambientLightColor = gl.getUniformLocation(program, 'uAmbientLightColor');
const diffuseLightColor = gl.getUniformLocation(program, 'uDiffuseLightColor');
const specularLightColorFront = gl.getUniformLocation(program, 'uSpecularLightColorFront');
const specularLightColorBack = gl.getUniformLocation(program, 'uSpecularLightColorBack');
const lightDirectionLocation = gl.getUniformLocation(program, 'uLightDirection');
function drawScene() {
    mat4.rotate(modelViewMatrix, modelViewMatrix, 0.03, [1, 1, 0]);
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

    gl.uniform3fv(lightDirectionLocation, [1, 0, 0]);
    gl.uniform3fv(ambientLightColor, [1.0, 1.0, 1.0]);
    gl.uniform3fv(diffuseLightColor, [1.0, 0.0, 0.0]);
    gl.uniform3fv(specularLightColorFront, [1.0, 0.0, 1.0]);
    gl.uniform3fv(specularLightColorBack, [1.0, 0.0, 0.0]);
    gl.uniform3fv(cubeColorLocation,[1.0, 1.0, 0.0] );  //[Math.sin(Date.now() * 0.001), Math.cos(Date.now() * 0.001), 0.8]
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length);
    requestAnimationFrame(drawScene);
}
drawScene();