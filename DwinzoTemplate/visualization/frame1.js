const canvas = document.getElementById('canvas');
const gl = canvas.getContext('2d');
const drawFrame = document.getElementById('frame');
const div = document.getElementById('div');
const shapes = [];
let isDrawing;
let frameClicked = false;
let isMovingFrame = false;
let startX, startY, currentFrame;
let frames = [];
let selectedFrameIndex = -1;
let selectedShapeIndex = -1;
let frameCounter = 1; // Counter for generating unique frame IDs
let isResizingFrame;
let selectedScalingPointIndex = -1;
let isDrawingRectangle = false;
let isDrawingCircle = false;
const template = document.querySelector('.rem');
const container = document.querySelector('.container');
const treeView = document.getElementById('ul');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.oncontextmenu = function () { return false; }

canvas.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCanvas();
});

let colorPickers = document.getElementsByClassName('colorPicker');
let clrDisplays = document.getElementsByClassName('clrdisplay');
let selectedColor = 'white'; // Set default color

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
        gl.fillStyle = 'transparent';
        gl.strokeRect(startX, startY, width, height);
        gl.fillRect(startX, startY, width, height);
        currentFrame = { id: `${frameCounter++}`, x: startX, y: startY, width, height };
    });
    canvas.addEventListener('mouseup', function eventHandler(e) {
        if (!isDrawing) return;
        isDrawing = false;
        if (currentFrame.width > 0 && currentFrame.height > 0) {
            for (let i = 0; i < colorPickers.length; i++) {
                colorPickers[i].addEventListener("input", function () {
                    selectedColor = colorPickers[i].value;
                    clrDisplays[i].innerHTML = selectedColor;
                    frames.push(selectedColor);
                });
            }
            frames.push({
                id: currentFrame.id,
                x: currentFrame.x,
                y: currentFrame.y,
                width: currentFrame.width,
                height: currentFrame.height,
                color: selectedColor,
            });
        }
        canvas.removeEventListener('mouseup', eventHandler);
        drawCanvas();
    });
})

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
    // Draw shapes within frames first
    frames.forEach((frame, i) => {
        gl.save();
        gl.translate(frame.x + frame.width / 2, frame.y + frame.height / 2);
        gl.translate(-(frame.x + frame.width / 2), -(frame.y + frame.height / 2));
        gl.fillStyle = frame.color;
        gl.fillRect(frame.x, frame.y, frame.width, frame.height);

        gl.fillStyle = 'black';
        gl.font = "12px Verdana";
        gl.fillText(`Frame ${i + 1}`, frame.x, frame.y - 10);
        drawFrameBorder(frame, i);
        drawFrameText(frame);
        drawScalingPoints(frame);
        gl.restore();
    });
    shapes.forEach((shape, i) => {
        gl.fillStyle = shape.color;
        gl.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);
        gl.translate(-(shape.x + shape.width / 2), -(shape.y + shape.height / 2));
        if (shape.type === 'rectangle') {
            gl.fillRect(shape.x, shape.y, shape.width, shape.height);
            gl.fillStyle = 'black';
            gl.font = "12px Verdana";
            gl.fillText(`Rectangle`, shape.x, shape.y - 10);
            drawShapeBorder(shape);
            drawScalingPoints(shape);
            drawShapeText(shape);
        }
        if (shape.type === 'circle') {
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
            gl.fillStyle = 'black';
            gl.font = "12px Verdana";
            gl.fillText(`Circle`, shape.x, shape.y - 10);
            drawShapeBorder(shape, i);
            drawScalingPoints(shape);
            drawShapeText(shape);
        }
    });
}

function drawShapeBorder(shape, i) {
    if (i === selectedShapeIndex) {
        gl.strokeStyle = 'skyblue';
        gl.lineWidth = 4;
        drawShapeText(shape, i)
        gl.strokeRect(shape.x, shape.y, shape.width, shape.height);
        drawScalingPoints(shape);
    } else {
        gl.strokeStyle = 'black';
        gl.lineWidth = 2;
        gl.strokeRect(shape.x, shape.y, shape.width, shape.height)

    }
}

function drawShapeText(shape) {
    gl.font = "12px Verdana";
    gl.fillStyle = 'black';
    gl.fillText(`${shape.width} × ${shape.height}`, shape.x + (shape.width / 2.5), shape.y + shape.height + 20);
}

function drawFrameBorder(frame, i) {
    if (i === selectedFrameIndex) {
        gl.strokeStyle = 'skyblue';
        gl.lineWidth = 4;
        drawFrameText(frame, i)
        gl.strokeRect(frame.x, frame.y, frame.width, frame.height);
        drawScalingPoints(frame);
    } else {
        gl.strokeStyle = 'black';
        gl.lineWidth = 2;
        gl.strokeRect(frame.x, frame.y, frame.width, frame.height);
    }
}

function drawFrameText(frame) {
    gl.font = "15px Verdana";
    gl.fillStyle = 'black';
    gl.fillText(`${frame.width} × ${frame.height}`, frame.x + (frame.width / 2.5), frame.y + frame.height + 20);
}

function drawScalingPoints(obj) {
    const scalingPointSize = 8;
    const scalingPointColor = 'white';
    const scalingPointBorderColor = 'skyblue';
    const borderWidth = 3;

    gl.fillStyle = scalingPointBorderColor;
    gl.fillRect(obj.x - scalingPointSize / 2 - borderWidth, obj.y - scalingPointSize / 2 - borderWidth, scalingPointSize + 2 * borderWidth, scalingPointSize + 2 * borderWidth);
    gl.fillRect(obj.x + obj.width - scalingPointSize / 2 - borderWidth, obj.y - scalingPointSize / 2 - borderWidth, scalingPointSize + 2 * borderWidth, scalingPointSize + 2 * borderWidth);
    gl.fillRect(obj.x - scalingPointSize / 2 - borderWidth, obj.y + obj.height - scalingPointSize / 2 - borderWidth, scalingPointSize + 2 * borderWidth, scalingPointSize + 2 * borderWidth);
    gl.fillRect(obj.x + obj.width - scalingPointSize / 2 - borderWidth, obj.y + obj.height - scalingPointSize / 2 - borderWidth, scalingPointSize + 2 * borderWidth, scalingPointSize + 2 * borderWidth);

    gl.fillStyle = scalingPointColor;
    gl.fillRect(obj.x - scalingPointSize / 2, obj.y - scalingPointSize / 2, scalingPointSize, scalingPointSize);
    gl.fillRect(obj.x + obj.width - scalingPointSize / 2, obj.y - scalingPointSize / 2, scalingPointSize, scalingPointSize);
    gl.fillRect(obj.x - scalingPointSize / 2, obj.y + obj.height - scalingPointSize / 2, scalingPointSize, scalingPointSize);
    gl.fillRect(obj.x + obj.width - scalingPointSize / 2, obj.y + obj.height - scalingPointSize / 2, scalingPointSize, scalingPointSize);
}

function isWithinFrame(shape, frame) {
    return (
        shape.x >= frame.x &&
        shape.y >= frame.y &&
        shape.x + shape.width <= frame.x + frame.width &&
        shape.y + shape.height <= frame.y + frame.height
    );
}

canvas.addEventListener('click', function (e) {
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        if (
            x >= frame.x &&
            x <= frame.x + frame.width &&
            y >= frame.y &&
            y <= frame.y + frame.height
        ) {
            selectedFrameIndex = i; // Update the selected frame index
            frameClicked = true;
            gl.clearRect(0, 0, canvas.width, canvas.height);
            drawCanvas(); // Redraw canvas to reflect selection
            break; // Exit loop since frame is found
        }
    }
});

canvas.addEventListener('mousemove', function eventHandlers(e) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    shapes.forEach((shape) => {
        if (shape.isSelected) {
            shape.x = mouseX - shape.offsetX;
            shape.y = mouseY - shape.offsetY;
        }
        drawCanvas();
    });
    if (isMovingFrame && selectedFrameIndex !== -1) {
        const frame = frames[selectedFrameIndex];
        frame.x = mouseX - offsetX;
        frame.y = mouseY - offsetY;
        drawCanvas();
    }

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
    if (isResizingFrame && selectedScalingPointIndex !== -1) {
        const point = scalingPoints[selectedScalingPointIndex];
        const shapeIndex = Math.floor(selectedScalingPointIndex / 4); // 4 points per shape
        const pointIndex = selectedScalingPointIndex % 4; // Index within the shape

        if (shapeIndex < shapes.length) {
            // Update shape size based on the scaling point
            const shape = shapes[shapeIndex];
            if (pointIndex === 0 || pointIndex === 3) {
                shape.x = mouseX;
                shape.width -= mouseX - point.x;
            } else {
                shape.width = mouseX - shape.x;
            }
            if (pointIndex === 0 || pointIndex === 1) {
                shape.y = mouseY;
                shape.height -= mouseY - point.y;
            } else {
                shape.height = mouseY - shape.y;
            }
        } else {
            // Update frame size based on the scaling point
            const frame = frames[shapeIndex - shapes.length];
            if (pointIndex === 0 || pointIndex === 3) {
                frame.x = mouseX;
                frame.width -= mouseX - point.x;
            } else {
                frame.width = mouseX - frame.x;
            }
            if (pointIndex === 0 || pointIndex === 1) {
                frame.y = mouseY;
                frame.height -= mouseY - point.y;
            } else {
                frame.height = mouseY - frame.y;
            }
        }

        drawCanvas();
    }
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

// Reset rotation angle when mouse is released
canvas.addEventListener('mouseup', function () {
    frameClicked = false;
});

function createTree(shapes, frames, parentUl, depth = 0, maxDepth = 10) {
    // Clear the existing content of parentUl
    parentUl.innerHTML = '';

    // Iterate through shapes
    shapes.forEach(shape => {
        const li = document.createElement("li");
        li.draggable = true;
        li.id = shape.id;
        const text = document.createTextNode(shape.type.toUpperCase());
        li.appendChild(text);

        // Check if the shape has children frames
        if (shape.children && shape.children.length > 0) {
            const nestedUl = document.createElement("ul");
            li.appendChild(nestedUl);
            if (parentUl !== nestedUl) {
                // Recursively create tree for children frames
                createTree(shape.children, frames, nestedUl, depth + 1, maxDepth);
            }
        }

        // Append the shape to the parentUl
        parentUl.appendChild(li);
    });

    // Iterate through frames
    frames.forEach(frame => {
        const li = document.createElement("li");
        li.draggable = true;
        li.id = frame.id;
        const text = document.createTextNode(`Frame ${frame.id}`);
        li.appendChild(text);

        // Check if the frame has children shapes
        if (frame.children && frame.children.length > 0) {
            const nestedUl = document.createElement("ul");
            li.appendChild(nestedUl);
            if (parentUl !== nestedUl) {
                // Recursively create tree for children shapes
                createTree(frame.children, frames, nestedUl, depth + 1, maxDepth);
            }
        }

        // Append the frame to the parentUl
        parentUl.appendChild(li);
    });
}

// Call the createTree function with shapes, frames, and the tree view element
createTree(shapes, frames, treeView);

treeView.addEventListener("click", function (event) {
    if (event.target.tagName.toLowerCase() === "li") {
        const clickedLi = event.target;
        const nestedUl = clickedLi.querySelector("ul");
        if (nestedUl) {
            nestedUl.style.display = (nestedUl.style.display === "none") ? "block" : "none";
        }
        const nestedLi = clickedLi.querySelector("li");
        if (nestedLi) {
            nestedLi.style.display = (nestedLi.style.display === "none") ? "block" : "none";
        }
    }
});
function createTreeViewItem(id, type) {
    const li = document.createElement("li");
    li.draggable = true;
    li.id = id;
    const text = document.createTextNode(type.toUpperCase());
    li.appendChild(text);
    treeView.appendChild(li);
    return li;
}
document.addEventListener("dragstart", function (event) {
    if (event.target.tagName.toLowerCase() === "li") {
        event.target.style.opacity = 1;
        event.dataTransfer.setData("text", event.target.id);
    }
});

document.addEventListener("dragover", function (event) {
    event.preventDefault();
    if (event.target.tagName.toLowerCase() === "li") {
        event.target.style.border = "1px dashed #000000";
    }
});

document.addEventListener("drop", function (event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedLi = document.getElementById(data);
    const targetLi = event.target;
    const isDropTargetInDiv = isElementInDiv(targetLi);
    // Check if the drop target is an individual parent element in the tree view
    const isDropTargetParent = targetLi.tagName.toLowerCase() === "li" && targetLi.childElementCount > 0;
    if (isDropTargetInDiv) {
        const parentShapeId = parseInt(targetLi.id);
        const parentShape = shapes.find(shape => shape.id === parentShapeId);
        // Check if the dragged element is a child element
        const isChildElement = targetLi.parentNode !== draggedLi.parentNode;
        if (isChildElement && isDropTargetParent) {
            // Remove child functionalities if dropped as an individual parent element
            parentShape.children = [];
        } else {
            // Add the dragged element as a child
            if (parentShape) {
                const childShapeId = shapes.find(shape => shape.id === parseInt(data)).id;
                const childShape = shapes.find(shape => shape.id === childShapeId);
                if (childShape) {
                    parentShape.children.push(childShape);
                }
            }
        }
        // Append the dragged element to the drop target
        targetLi.appendChild(draggedLi);
    }
    resetOpacity();
});

document.addEventListener("dragend", function () {
    resetOpacity();
});

function isElementInDiv(element) {
    const divContainer = document.getElementById("div");
    return divContainer.contains(element);
}

function resetOpacity() {
    const draggableItems = document.querySelectorAll("li");
    draggableItems.forEach(item => {
        item.style.opacity = 12;
        item.style.border = "";
    });
}
