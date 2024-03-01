let canvas = document.getElementById('canvas');
let gl = canvas.getContext('2d');
let drawFrame = document.getElementById('frame');
let shapes = [];
let startX, startY, currentFrame;
let isMovingFrame = false;
let selectedFrameIndex = -1;
let selectedShapeIndex = -1;
let offsetX, offsetY;
let frames = [];
let isResizingFrame;
let selectedScalingPointIndex = -1;
let frameCounter = 1; // Counter for generating unique frame IDs

let isDrawing;
let isDrawingRectangle = false;
let isDrawingCircle = false;
document.oncontextmenu = function () { return false; }
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
    gl.strokeRect(startX, startY, width, height);
    currentFrame = { id: `${frameCounter++}`, x: startX, y: startY, width, height };
  });
  canvas.addEventListener('mouseup', function eventHandler(e) {
    if (!isDrawing) return;
    isDrawing = false;
    if (currentFrame.width > 0 && currentFrame.height > 0) {
      for (let i = 0; i < colorPickers.length; i++) {
        colorPickers[i].addEventListener("input", function () {
          const selectedColor = colorPickers[i].value;
          clrDisplays[i].innerHTML = selectedColor;
          frames.push(selectedColor);
          shapes.push(selectedColor);
          console.log(selectedColor)
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
    gl.fillStyle = frame.color;
    gl.strokeRect(frame.x, frame.y, frame.width, frame.height);
    gl.font = "15px Verdana";
    gl.fillStyle = 'grey';
    gl.fillText(`${frame.width} × ${frame.height}`, frame.x + (frame.width / 2.5), frame.y - 10);
    gl.fillText(`Frame ${index + 1}`, frame.x + (frame.width / 2.5), frame.y + frame.height + 20);
    gl.fillRect(frame.x, frame.y, frame.width, frame.height);
    drawFrameBorder(frame, index)
  });
  shapes.forEach((shape, index) => {
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
    drawShapeBorder(shape, index)
  });
}
function drawFrameBorder(frame, index) {
  if (index === selectedFrameIndex) {
    gl.strokeStyle = 'skyblue';
    gl.lineWidth = 4;
    drawFrameText(frame)
    gl.strokeRect(frame.x, frame.y, frame.width, frame.height);
    drawScalingPoints(frame);
  } else {
    gl.strokeStyle = 'black';
    gl.lineWidth = 2;
    gl.strokeRect(frame.x, frame.y, frame.width, frame.height);
  }
}
function drawShapeBorder(shape, index) {
  if (index === selectedShapeIndex) {
    gl.strokeStyle = 'skyblue';
    gl.lineWidth = 4;
    drawShapeText(shape)
    gl.strokeRect(shape.x, shape.y, shape.width, shape.height);
    drawScalingPoints(shape);
  } else {
    gl.strokeStyle = 'black';
    gl.lineWidth = 2;
    gl.strokeRect(shape.x, shape.y, shape.width, shape.height)

  }
}
function drawShapeText(shape) {
  gl.font = "15px Verdana";
  gl.fillStyle = 'black';
  gl.fillText(`${shape.width} × ${shape.height}`, shape.x + (shape.width / 2.5), shape.y + shape.height + 20);
}
function drawFrameText(frame) {
  gl.font = "15px Verdana";
  gl.fillStyle = 'black';
  gl.fillText(`${frame.width} × ${frame.height}`, frame.x + (frame.width / 2.5), frame.y + frame.height + 20);
}
function drawScalingPoints(object) {
  const scalingPointSize = 8;
  const scalingPointColor = 'white';
  const scalingPointBorderColor = 'skyblue';
  const borderWidth = 3;

  gl.fillStyle = scalingPointBorderColor;
  gl.fillRect(object.x - scalingPointSize / 2 - borderWidth, object.y - scalingPointSize / 2 - borderWidth, scalingPointSize + 2 * borderWidth, scalingPointSize + 2 * borderWidth);
  gl.fillRect(object.x + object.width - scalingPointSize / 2 - borderWidth, object.y - scalingPointSize / 2 - borderWidth, scalingPointSize + 2 * borderWidth, scalingPointSize + 2 * borderWidth);
  gl.fillRect(object.x - scalingPointSize / 2 - borderWidth, object.y + object.height - scalingPointSize / 2 - borderWidth, scalingPointSize + 2 * borderWidth, scalingPointSize + 2 * borderWidth);
  gl.fillRect(object.x + object.width - scalingPointSize / 2 - borderWidth, object.y + object.height - scalingPointSize / 2 - borderWidth, scalingPointSize + 2 * borderWidth, scalingPointSize + 2 * borderWidth);

  gl.fillStyle = scalingPointColor;
  gl.fillRect(object.x - scalingPointSize / 2, object.y - scalingPointSize / 2, scalingPointSize, scalingPointSize);
  gl.fillRect(object.x + object.width - scalingPointSize / 2, object.y - scalingPointSize / 2, scalingPointSize, scalingPointSize);
  gl.fillRect(object.x - scalingPointSize / 2, object.y + object.height - scalingPointSize / 2, scalingPointSize, scalingPointSize);
  gl.fillRect(object.x + object.width - scalingPointSize / 2, object.y + object.height - scalingPointSize / 2, scalingPointSize, scalingPointSize);
}
// Define scaling points for shapes and frames
const scalingPointSize = 8; // Adjust the size as needed
const scalingPoints = [];

// Add scaling points for shapes
shapes.forEach((shape) => {
  scalingPoints.push(
    { x: shape.x, y: shape.y }, // Top-left
    { x: shape.x + shape.width, y: shape.y }, // Top-right
    { x: shape.x + shape.width, y: shape.y + shape.height }, // Bottom-right
    { x: shape.x, y: shape.y + shape.height } // Bottom-left
  );
});

// Add scaling points for frames
frames.forEach((frame) => {
  scalingPoints.push(
    { x: frame.x, y: frame.y }, // Top-left
    { x: frame.x + frame.width, y: frame.y }, // Top-right
    { x: frame.x + frame.width, y: frame.y + frame.height }, // Bottom-right
    { x: frame.x, y: frame.y + frame.height } // Bottom-left
  );
});


canvas.addEventListener('mousemove', function eventHandlers(e) {
  const mouseX = e.clientX - canvas.offsetLeft;
  const mouseY = e.clientY - canvas.offsetTop;
  if (isMovingFrame && selectedFrameIndex !== -1) {
    const frame = frames[selectedFrameIndex];
    frame.x = mouseX - offsetX;
    frame.y = mouseY - offsetY;
  }
  drawCanvas();

  // Move selected shape
  shapes.forEach((shape) => {
    if (shape.isSelected) {
      shape.x = mouseX - shape.offsetX;
      shape.y = mouseY - shape.offsetY;
    }
    drawCanvas();
  });

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

  scalingPoints.forEach((point, index) => {
    if (
      mouseX >= point.x - scalingPointSize / 2 &&
      mouseX <= point.x + scalingPointSize / 2 &&
      mouseY >= point.y - scalingPointSize / 2 &&
      mouseY <= point.y + scalingPointSize / 2
    ) {
      isResizingFrame = true;
      selectedScalingPointIndex = index;
    }
  });
});

canvas.addEventListener('mouseup', function eventHandler(e) {
  if (isDrawingRectangle || isDrawingCircle) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
    const width = mouseX - startX;
    const height = mouseY - startY;
    isResizingFrame = false;
    selectedScalingPointIndex = -1;

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
