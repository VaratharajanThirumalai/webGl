import {triangle} from "./triangle.js";
import {orthoCamera} from "./orthoMove.js";
function render() {
    orthoCamera()
    triangle(0,0,0)
    requestAnimationFrame(orthoCamera)

}
render()