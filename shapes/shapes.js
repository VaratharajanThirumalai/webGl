const canvas = document.getElementById('gridline');
const gl = canvas.getContext('2d');
const div = document.getElementById('my-div');
div.style.display = 'none';
const shapes = [];
let selectedShape = null;
const objectWidth = selectedShape.width;
const objectHeight = selectedShape.height;
let isDragging = false;
let offsetX = 0, offsetY = 0;
let isScaling = false;
let scaleHandleRadius = 10;

canvas.addEventListener('click', (e) => {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;
    if (e.ctrlKey) {
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        div.style.display = '';
    }
});

function drawShapes() {
    gl.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        gl.save();
        gl.fillStyle = shape.color;
        gl.translate(shape.x, shape.y);
        gl.scale(shape.scale, shape.scale);
        if (shape.type === "rectangle") {
            gl.fillRect(0, 0, shape.width, shape.height);
        } else if (shape.type === "circle") {
            gl.beginPath();
            gl.arc(0, 0, shape.radius, 0, Math.PI * 2);
            gl.fill();
        }
        if (shape === selectedShape) {
            gl.fillStyle = "rgba(0, 0, 0, 0.5)";
            gl.beginPath();
            gl.arc(shape.width, shape.height, scaleHandleRadius, 0, Math.PI * 2);
            gl.fill();
        }
        gl.restore();
    });
};
const deleteButton = document.getElementById('delete-button');
let closestIndex = -1;
deleteButton.addEventListener('click', (e) => {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    let closestDistance = Number.MAX_SAFE_INTEGER;
    shapes.forEach((shape1, index) => {
        const distance = Math.sqrt((x - shape1.x) ** 2 + (y - shape1.y) ** 2);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });
    if (closestIndex !== -1) {
        shapes.splice(closestIndex, 1);
        drawShapes();
    }
    div.style.display = 'none';
});
const copyButton = document.getElementById('Copy-button');
copyButton.addEventListener('click', (e) => {
    if (selectedShape) {
        let x = e.clientX - canvas.getBoundingClientRect().left;
        let y = e.clientY - canvas.getBoundingClientRect().top;
        const copyshape = selectedShape.img;
        const copyWidth = objectWidth;
        const copyHeight = objectHeight;
        const minX = 0;
        const minY = 0;
        const maxX = canvas.width - (objectWidth + 2 * 10 + 2 * 5);
        const maxY = canvas.height - (objectHeight + 2 * 10 + 2 * 5);
        x = Math.min(Math.max(x, minX), maxX);
        y = Math.min(Math.max(y, minY), maxY);
        shapes.push({
            img: copyshape, x, y, width: copyWidth, height: copyHeight,
            id: Date.now().toString(), padding: 5, margin: 3,
        });
        drawShapes();
        div.style.display = 'none';
    }
});
canvas.addEventListener('mousedown', (e) => {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    shapes.forEach((shape) => {
        if (isPointInsideShape(x, y, shape)) {
            selectedShape = shape;
            offsetX = x - selectedShape.x;
            offsetY = y - selectedShape.y;
            selectedShape.isDragging = true;
            if (x >= shape.x && x <= shape.x + objectWidth && y >= shape.y && y <= shape.y + objectHeight) {
                isScaling = true
            }
        }
    });
    document.onmouseup = function () {
        selectedShape.isDragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
    };
});
canvas.addEventListener('mousemove', (e) => {
    if (selectedShape.isDragging && selectedShape) {
        const x = e.clientX - canvas.getBoundingClientRect().left;
        const y = e.clientY - canvas.getBoundingClientRect().top;
        const minX = 0;
        const minY = 0;
        const maxX = canvas.width - objectWidth;
        const maxY = canvas.height - objectHeight;
        selectedShape.x = Math.min(Math.max(x - offsetX, minX), maxX);
        selectedShape.y = Math.min(Math.max(y - offsetY, minY), maxY);
        if (isScaling) {
            selectedShape.width = mouseX - selectedShape.x;
            selectedShape.height = mouseY - selectedShape.y;
        } else {
            selectedShape.x = mouseX - offsetX;
            selectedShape.y = mouseY - offsetY;
        }
        drawShapes();
        overlap()
    }

});
canvas.addEventListener('mouseup', (e) => {
    if (selectedShape) {
        selectedShape.isDragging = false;
        if (offsetX !== 0 || offsetY !== 0) {
            shapes.push({ ...selectedShape, x: selectedShape.x + offsetX, y: selectedShape.y + offsetY, isDragging: false });
        }
    }
    selectedShape = null;
    isScaling = false;

    drawShapes();
});

function isPointInsideShape(x, y, shape) {
    if (shape.type === "rectangle") {
        return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height;
    } else if (shape.type === "circle") {
        const distance = Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2);
        return distance <= shape.radius * shape.scale;
    }
    return false;
}
function overlap() {
    if (selectedShape) {
        const padding = selectedShape.padding;
        const margin = selectedShape.margin;
        x = selectedShape.x;
        y = selectedShape.y;
        const width = objectWidth + 2 * (padding + margin);
        const height = objectHeight + 2 * (padding + margin);
        gl.fillStyle = 'white';
        gl.fillRect(x - margin, y - margin, width, height);
        gl.drawShapes(selectedShape.img, x + padding, y + padding, objectWidth, objectHeight);
    }
}

