import * as Game from './Mainexport.js'
const canvas = document.getElementById("webglCanvas");
const gl = canvas.getContext('webgl');
let valueX = 2;
canvas.addEventListener('mousedown', (e) => {
    if (e.shiftKey === false && e.button === 0) {
        valueX++
    }
    else if (e.shiftKey === true && e.button === 0) {
        valueX--
        if (valueX <= 2) {
            valueX = 2
        }
    }
});

function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    Game.Plane(canvas, gl, 4)
    // Game.Cube(canvas, gl, 3)
    // Game.Collision(canvas, gl, 0, 0.5, 0, 0, 6, 15)
    requestAnimationFrame(render)
}
render()
