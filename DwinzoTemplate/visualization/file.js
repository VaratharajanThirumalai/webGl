let canvas = document.getElementById('canvas');
let gl = canvas.getContext('2d');
let drawFrame = document.getElementById('frame');
let shapes = [];
let startX, startY, currentFrame;
let isMovingFrame = false;
let selectedFrameIndex = -1;
let offsetX, offsetY;
let frames = [];
let isResizingFrame;
let selectedScalingPointIndex = -1;
let isDrawing;
let isDrawingRectangle = false;
let isDrawingCircle = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.oncontextmenu = function () { return false; }

canvas.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCanvas();
});

drawFrame.addEventListener('click', function frame() {
    canvas.addEventListener('mousedown', function event(e) {
        isDrawing = true;
        startX = e.clientX - canvas.offsetLeft;
        startY = e.clientY - canvas.offsetTop;
        canvas.removeEventListener('mousedown', event);
    });
    canvas.addEventListener('mousemove', function eventHandlers(e) {
        if (!isDrawing) return;

        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;
        const width = x - startX;
        const height = y - startY;
        gl.clearRect(0, 0, canvas.width, canvas.height);
        gl.strokeStyle = 'black';
        gl.strokeRect(startX, startY, width, height);
        currentFrame = { x: startX, y: startY, width, height };
    });
    canvas.addEventListener('mouseup', function eventHandler(e) {
        if (!isDrawing) return;

        isDrawing = false;
        if (currentFrame.width > 0 && currentFrame.height > 0) {
            frames.push({
                x: currentFrame.x,
                y: currentFrame.y,
                width: currentFrame.width,
                height: currentFrame.height,
            });
        }
        drawCanvas();
    });
});

document.getElementById('rect').addEventListener('click', function () {
    isDrawingRectangle = true;
    isDrawingCircle = false;
});

document.getElementById('cir').addEventListener('click', function () {
    isDrawingCircle = true;
    isDrawingRectangle = false;
});

function drawCanvas() {
    gl.clearRect(0, 0, canvas.width, canvas.height);
    frames.forEach((frame, index) => {
        gl.fillStyle = 'red';
        gl.strokeRect(frame.x, frame.y, frame.width, frame.height);
        document.getElementById('x-value').value = frame.x;
        document.getElementById('y-value').value = frame.y;
        document.getElementById('w-value').value = frame.width;
        document.getElementById('h-value').value = frame.height;
        gl.font = "15px Verdana";
        gl.fillStyle = 'grey';
        gl.fillText(`${frame.width} × ${frame.height}`, frame.x + (frame.width / 2.5), frame.y - 10);
        gl.fillText(`Frame ${index + 1}`, frame.x + (frame.width / 2.5), frame.y + frame.height + 20);
        gl.fillRect(frame.x, frame.y, frame.width, frame.height);
    });
    shapes.forEach((shape) => {
        gl.fillStyle = shape.color;
        if (shape.type === 'rectangle') {
            gl.fillRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === 'circle') {
            gl.beginPath();
            gl.arc(
                shape.x + shape.width / 2,
                shape.y + shape.height / 2,
                shape.width / 2,
                0,
                2 * Math.PI
            );
            gl.closePath();
            gl.fill();
        }
    });
}

canvas.addEventListener('mousemove', function eventHandlers(e) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    if (isMovingFrame && selectedFrameIndex !== -1) {
        const frame = frames[selectedFrameIndex];
        frame.x = mouseX - offsetX;
        frame.y = mouseY - offsetY;
        drawCanvas();
    }
//scaling for frame 
    if (isResizingFrame && selectedFrameIndex !== -1 && selectedScalingPointIndex !== -1) {
        const frame = frames[selectedFrameIndex];

        switch (selectedScalingPointIndex) {
            case 0: // Top-left
                frame.width += frame.x - mouseX;
                frame.height += frame.y - mouseY;
                frame.x = mouseX;
                frame.y = mouseY;
                break;
            case 1: // Top-right
                frame.width = mouseX - frame.x;
                frame.height += frame.y - mouseY;
                frame.y = mouseY;
                break;
            case 2: // Bottom-left
                frame.width += frame.x - mouseX;
                frame.height = mouseY - frame.y;
                frame.x = mouseX;
                break;
            case 3: // Bottom-right
                frame.width = mouseX - frame.x;
                frame.height = mouseY - frame.y;
                break;
            default:
                break;
        }
        drawCanvas();
    }
    // Move selected shape
    shapes.forEach((shape) => {
        if (shape.isSelected) {
            shape.x = mouseX - shape.offsetX;
            shape.y = mouseY - shape.offsetY;
        }
    });
    drawCanvas();
});

canvas.addEventListener('mousedown', function event(e) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    if (isDrawingRectangle || isDrawingCircle) {
        startX = mouseX;
        startY = mouseY;
        isDrawing = true;
    } else {
        frames.forEach((frame, index) => {
            shapes.forEach((shape) => {
                if (
                    mouseX >= shape.x &&
                    mouseX <= shape.x + shape.width &&
                    mouseY >= shape.y &&
                    mouseY <= shape.y + shape.height
                ) {
                    shape.isSelected = true;
                    shape.offsetX = mouseX - shape.x;
                    shape.offsetY = mouseY - shape.y;
                } else {
                    shape.isSelected = false;
                }
            });

            // Check if a frame is clicked
            frames.forEach((frame, index) => {
                if (
                    mouseX >= frame.x &&
                    mouseX <= frame.x + frame.width &&
                    mouseY >= frame.y &&
                    mouseY <= frame.y + frame.height
                ) {
                    isMovingFrame = true;
                    selectedFrameIndex = index;
                    offsetX = mouseX - frame.x;
                    offsetY = mouseY - frame.y;
                }
            });
        });
    }
});
canvas.addEventListener('mouseup', function eventHandler(e) {
    if (isDrawingRectangle || isDrawingCircle) {
        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;
        const width = mouseX - startX;
        const height = mouseY - startY;

        if (width !== 0 && height !== 0) {
            if (isDrawingRectangle) {
                shapes.push({ x: startX, y: startY, width: width, height: height, type: 'rectangle', color: 'blue' });
            } else if (isDrawingCircle) {
                shapes.push({ x: startX, y: startY, width: width, height: height, type: 'circle', color: 'green' });
            }
            drawCanvas();
        }
        isDrawingRectangle = false;
        isDrawingCircle = false;
        isDrawing = false;
    } else {
        isMovingFrame = false;
        isResizingFrame = false;
        selectedFrameIndex = -1;
        selectedScalingPointIndex = -1;
    }
    shapes.forEach((shape) => {
        shape.isSelected = false;
    });
});
document.addEventListener('keydown', function (event) {
    if (event.key === 'Delete' && selectedFrameIndex !== -1) {
        frames.splice(selectedFrameIndex, 1);
        selectedFrameIndex = -1;
        drawCanvas();
    }
});